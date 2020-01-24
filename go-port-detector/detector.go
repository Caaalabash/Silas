package main

import (
	"flag"
	"fmt"
	"net"
	"strconv"
	"sync"
	"time"
)

var timeout int
var protocol string
var routineLimit int

var availablePort []int
var finishCount int
var lock sync.Mutex
var lockArr sync.Mutex

const totalPortCount = 65536
const START = "START"
const STOP = "STOP"

type Progress struct {
	Total   int
	Percent int
}

func (p Progress) Show() {
	pivot := p.Percent * p.Total / 100
	str := ""
	for i := 0; i < p.Total; i++ {
		if i < pivot {
			str += "="
		} else {
			str += " "
		}
	}
	fmt.Printf("\r[%s] %d%%", str, p.Percent)
}

func setupProgressBar(statusChan *chan string) string {
	for {
		time.Sleep(time.Millisecond * 300)
		percent := finishCount * 100 / totalPortCount
		Progress{50, percent}.Show()
		if finishCount == 0 {
			*statusChan <- START
		}
		if finishCount == totalPortCount {
			*statusChan <- STOP
		}
	}
}

func setupFlag() func() {
	flag.IntVar(&timeout, "t", 500, "检测超时毫秒时间（默认500）")
	flag.IntVar(&routineLimit, "l", 100, "并发控制数量（默认100）")
	flag.StringVar(&protocol, "p", "tcp", "检测协议，tcp 或者 udp")
	flag.Parse()
	return func() {
		fmt.Println("端口探测器")
		flag.PrintDefaults()
	}
}

func checkPort(ip string, port int, wg *sync.WaitGroup, limitChan *chan struct{}) {
	target := ip + ":" + strconv.Itoa(port)
	conn, err := net.DialTimeout(protocol, target, time.Millisecond*time.Duration(timeout))
	if err == nil {
		lockArr.Lock()
		availablePort = append(availablePort, port)
		lockArr.Unlock()
		_ = conn.Close()
	}
	lock.Lock()
	finishCount++
	lock.Unlock()
	<-*limitChan
	wg.Done()
}

func main() {
	usageFunc := setupFlag()
	if protocol != "tcp" {
		protocol = "udp"
	}
	if len(flag.Args()) != 1 {
		usageFunc()
		return
	}
	if ip := net.ParseIP(flag.Arg(0)); ip == nil {
		usageFunc()
		return
	} else {
		statusChan := make(chan string, 2)
		limitChan := make(chan struct{}, routineLimit)
		go setupProgressBar(&statusChan)

		for {
			status := <-statusChan
			if status == START {
				var wg sync.WaitGroup
				for i := 0; i < totalPortCount; i++ {
					wg.Add(1)
					limitChan <- struct{}{}
					go checkPort(ip.String(), i, &wg, &limitChan)
				}
				wg.Wait()
			} else if status == STOP {
				for _, port := range availablePort {
					fmt.Printf("\n可用端口: %d", port)
				}
				break
			}
		}
	}
}
