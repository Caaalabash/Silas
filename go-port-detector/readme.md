## 端口扫描器

Usage

````
端口探测器
  -l int
        并发控制数量（默认100） (default 100)
  -p string
        检测协议，tcp 或者 udp (default "tcp")
  -t int
        检测超时时间（默认500） (default 500)
````

Example

````
detector.exe -l 1000 -t 1000 10.10.10.10
detector.exe 10.10.10.10
````