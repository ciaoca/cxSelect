# cityData-simple.json 正则替换

## 替换一级省市区
```react
^(\s{4}"n":\s+"(.+)[省市]"
^(\s{4})"n":\s+"(.+)(壮族|回族|维吾尔)自治区"
^(\s{4})"n":\s+"(.+)(自治区|特别行政区)"

$1"n": "$2"
```

## 替换二级地区 - 1
```
^(\s{6}){"n":\s+"(.{2,})市"
^(\s{6}){"n":\s+"(.{2,})新区"
^(\s{6}){"n":\s+"(.{2,})区"
^(\s{6}){"n":\s+"(.{2,})自治县"（需要检查）
^(\s{6}){"n":\s+"(.{2,})县"

$1{"n": "$2"
```

## 替换二级地区 - 2
```
^(\s{8})"n":\s+"(.{2,})市"
^(\s{8})"n":\s+"(.{2,})地区"
^(\s{8})"n":\s+"(.{2,})县"
^(\s{8})"n":\s+"(.{2,})盟"
^(\s{8})"n":\s+"(.{2,})自治州"（需要检查）

$1"n": "$2"
```
