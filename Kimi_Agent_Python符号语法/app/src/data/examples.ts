// 每个叶子板块的完整实战示例（可直接复制到解释器运行）
export interface Example {
  title: string;
  code: string;
}

export const EXAMPLES: Record<string, Example[]> = {
  arith: [
    {
      title: '除法家族与序列重复',
      code: 'print(7 / 2)      # 3.5，真除法恒得浮点\nprint(7 // 2)     # 3\nprint(-7 // 2)    # -4，向下取整而非截断\nprint(7 % 2)      # 1\nprint(2 ** 10)    # 1024\nprint("ab" * 3)   # ababab',
    },
  ],
  compare: [
    {
      title: '== 与 is 的区别',
      code: 'a = [1, 2]\nb = [1, 2]\nprint(a == b)   # True，值相等\nprint(a is b)   # False，不是同一对象\n\nx = 50\nprint(0 <= x <= 100)   # True，链式比较\nprint(3 in [1, 2, 3])  # True，成员判断',
    },
  ],
  logic: [
    {
      title: '短路求值的实际用途',
      code: 'name = "" or "匿名"\nprint(name)   # 匿名，前者为假取后者\n\ndef fetch():\n    print("执行了查询")\n    return [1, 2]\n\ndata = [] or fetch()   # [] 为假，才会执行 fetch\n# 执行了查询\nprint(data)            # [1, 2]',
    },
  ],
  bits: [
    {
      title: '用位运算管理权限标志',
      code: 'READ, WRITE, EXEC = 0b100, 0b010, 0b001\n\nperm = READ | WRITE     # 组合权限：0b110\nprint(perm & READ)      # 4，含读权限\nprint(perm & EXEC)      # 0，无执行权限\nprint(perm ^ READ)      # 2，去掉读权限\nprint(READ << 1)        # 2，左移一位',
    },
  ],
  assign: [
    {
      title: '解包与海象运算符',
      code: 'a, b = 1, 2\na, b = b, a              # 一行交换\nprint(a, b)              # 2 1\n\nfirst, *middle, last = [10, 20, 30, 40, 50]\nprint(first, middle, last)\n# 10 [20, 30, 40] 50\n\ndata = [3, 1, 4, 1, 5, 9, 2, 6]\nif (n := len(data)) > 5:\n    print(f"数据偏长，共 {n} 项")  # 数据偏长，共 8 项',
    },
  ],
  brackets: [
    {
      title: '三种括号各司三职',
      code: 'point = (3, 4)            # ( ) 元组\nprint(point[0])           # 3\n\nnums = [1, 2, 3, 4, 5]    # [ ] 列表\nprint(nums[1:4])          # [2, 3, 4]\n\nperson = {"name": "小明"}  # { } 字典\ntags = {"python", "web"}  # { } 集合\nprint({"a", "b"} | tags)  # 集合并集',
    },
  ],
  colon: [
    {
      title: '切片三板斧',
      code: 's = "hello world"\nprint(s[:5])     # hello\nprint(s[6:])     # world\nprint(s[::-1])   # dlrow olleh，步长 -1 反转\n\nmatrix = [[1, 2], [3, 4]]\nprint(matrix[0][1])   # 2',
    },
  ],
  comma: [
    {
      title: '逗号构建的隐式元组',
      code: 'def stats(a, b):\n    return a + b, a * b     # 返回的是元组 (和, 积)\n\ntotal, product = stats(3, 4)\nprint(total, product)              # 7 12\nprint("a", "b", "c", sep="-")      # a-b-c',
    },
  ],
  dot: [
    {
      title: '点号与方法链',
      code: 'import math\nprint(math.sqrt(16))   # 4.0，模块成员访问\n\ntext = "  Hello Python  "\nprint(text.strip().lower().split())\n# 方法链：去空格 → 转小写 → 切分\n# [\'hello\', \'python\']',
    },
  ],
  underscore: [
    {
      title: '下划线的日常用法',
      code: 'for _ in range(3):\n    print("重试")        # 不需要循环变量时用 _\n\nx, _, y = (1, 99, 2)     # 解包时忽略中间项\nprint(x, y)              # 1 2\n\nprice = 1_000_000        # 数字分隔符增强可读性\nprint(price)             # 1000000',
    },
  ],
  quotes: [
    {
      title: '引号的选择',
      code: "s1 = '单引号'\ns2 = \"双引号，可以包含 '单引号'\"\npoem = '''春眠不觉晓，\n处处闻啼鸟。'''\nprint(poem)",
    },
  ],
  escape: [
    {
      title: 'r 前缀的典型场景',
      code: 'path = r"C:\\new\\test"    # r 前缀：\\n 不会被当作换行\nprint(path)\n\nimport re\nprint(re.findall(r"\\d+", "a1b22c333"))\n# [\'1\', \'22\', \'333\']，正则几乎必须加 r',
    },
  ],
  format: [
    {
      title: 'f-string 格式控制',
      code: 'name, age, pi = "小明", 18, 3.14159\nprint(f"{name} 今年 {age} 岁")     # 小明 今年 18 岁\nprint(f"圆周率 ≈ {pi:.2f}")         # 圆周率 ≈ 3.14\nprint(f"{\'居中\':^10}|{age:>5}")   # 对齐控制\nprint(f"{255:#x}")                   # 0xff，进制转换',
    },
  ],
  comment: [
    {
      title: '规范的文档字符串',
      code: '# 单行注释：解释下一行的意图\ndef bmi(weight, height):\n    """计算身体质量指数。\n\n    参数: weight 体重(kg), height 身高(m)\n    返回: BMI 数值\n    """\n    return weight / height ** 2\n\n# TODO: 增加单位校验\nprint(bmi(60, 1.7))   # 20.76...',
    },
  ],
  star: [
    {
      title: '收集、限定与解包',
      code: 'def average(*nums):\n    return sum(nums) / len(nums)\n\nprint(average(80, 90, 100))   # 90.0\n\ndef show(name, *, city):       # city 仅限关键字传参\n    print(name, city)\n\nshow("小明", city="北京")      # 小明 北京\n\ndefaults = {"sep": "-", "end": "!\\n"}\nprint("a", "b", **defaults)    # a-b!\n\nmerged = {**{"a": 1}, **{"b": 2}}\nprint(merged)                  # {\'a\': 1, \'b\': 2}',
    },
  ],
  decorator: [
    {
      title: '手写一个计时装饰器',
      code: 'import time\n\ndef timer(func):\n    def wrapper(*args, **kwargs):\n        start = time.time()\n        result = func(*args, **kwargs)\n        print(f"{func.__name__} 耗时 {time.time() - start:.4f}s")\n        return result\n    return wrapper\n\n@timer                       # 等价 work = timer(work)\ndef work():\n    time.sleep(0.1)\n\nwork()   # work 耗时 0.10xx s',
    },
  ],
  typing: [
    {
      title: '现代类型注解写法',
      code: 'def repeat(text: str, times: int) -> str:\n    return text * times\n\ndef parse(raw: int | str) -> int | None:\n    try:\n        return int(raw)\n    except ValueError:\n        return None\n\nprint(repeat("ab", 3))   # ababab\nprint(parse("42"))       # 42\nprint(parse("x"))        # None',
    },
  ],
  walrus: [
    {
      title: '海象运算符消除重复计算',
      code: 'data = [3, 1, 4, 1, 5, 9, 2, 6]\n\n# 不用海象：len 要写两次\nif len(data) > 5:\n    print(len(data))\n\n# 用海象：一次计算，两处使用\nif (n := len(data)) > 5:\n    print(n)     # 8\n\n# 推导式中复用昂贵计算\nbig = [y for x in data if (y := x ** 2) > 10]\nprint(big)       # [16, 25, 81, 36]',
    },
  ],
  branch: [
    {
      title: '分支、三元与 match',
      code: 'score = 85\nif score >= 90:\n    grade = "A"\nelif score >= 60:\n    grade = "B"\nelse:\n    grade = "C"\nprint(grade)    # B\n\nresult = "及格" if score >= 60 else "不及格"\nprint(result)   # 及格\n\ncommand = "go north"\nmatch command.split():\n    case ["go", direction]:\n        print(f"向 {direction} 前进")   # 向 north 前进\n    case _:\n        print("未知命令")',
    },
  ],
  loop: [
    {
      title: 'for...else 与遍历利器',
      code: '# for...else：找出 10 以内的质数\nfor n in range(2, 10):\n    for x in range(2, n):\n        if n % x == 0:\n            break\n    else:                 # 内层未被 break → n 是质数\n        print(n, end=" ")   # 2 3 5 7\n\nnames = ["甲", "乙", "丙"]\nfor i, name in enumerate(names, 1):\n    print(i, name)      # 1 甲 / 2 乙 / 3 丙',
    },
  ],
  comprehension: [
    {
      title: '四种推导式一次看齐',
      code: 'words = ["hello", "world", "python"]\n\nupper = [w.upper() for w in words]\nprint(upper)     # [\'HELLO\', \'WORLD\', \'PYTHON\']\n\nlengths = {w: len(w) for w in words}\nprint(lengths)   # {\'hello\': 5, \'world\': 5, \'python\': 6}\n\nunique = {len(w) for w in words}\nprint(unique)    # {5, 6}\n\ngen = (x ** 2 for x in range(1000))   # 生成器：惰性计算\nprint(sum(gen))  # 332833500',
    },
  ],
  funcdef: [
    {
      title: '完整的参数声明顺序',
      code: 'def register(name, /, role="user", *tags, active=True, **extra):\n    """/ 前仅限位置，* 后仅限关键字"""\n    print(name, role, tags, active, extra)\n\nregister("小明", "admin", "vip", "new", active=False, city="北京")\n# 小明 admin (\'vip\', \'new\') False {\'city\': \'北京\'}',
    },
  ],
  lambda: [
    {
      title: 'lambda 排序与斐波那契生成器',
      code: 'students = [\n    {"name": "甲", "score": 88},\n    {"name": "乙", "score": 95},\n    {"name": "丙", "score": 72},\n]\nby_score = sorted(students, key=lambda s: s["score"], reverse=True)\nprint([s["name"] for s in by_score])   # [\'乙\', \'甲\', \'丙\']\n\ndef fib():\n    a, b = 0, 1\n    while True:\n        yield a\n        a, b = b, a + b\n\nfrom itertools import islice\nprint(list(islice(fib(), 8)))   # [0, 1, 1, 2, 3, 5, 8, 13]',
    },
  ],
  class: [
    {
      title: '继承与方法覆盖',
      code: 'class Animal:\n    def __init__(self, name):\n        self.name = name\n    def speak(self):\n        return "..."\n\nclass Dog(Animal):\n    def speak(self):              # 覆盖父类方法\n        return f"{self.name}: 汪汪"\n\npets = [Dog("旺财"), Dog("来福")]\nfor p in pets:\n    print(p.speak())   # 旺财: 汪汪 / 来福: 汪汪',
    },
  ],
  magic: [
    {
      title: '让自定义类支持内置语法',
      code: 'class Bag:\n    def __init__(self):\n        self.items = []\n    def __len__(self):\n        return len(self.items)\n    def __getitem__(self, i):\n        return self.items[i]\n    def __str__(self):\n        return f"Bag({len(self)} 件物品)"\n\nbag = Bag()\nbag.items = ["苹果", "香蕉", "钥匙"]\nprint(len(bag))   # 3，来自 __len__\nprint(bag[0])     # 苹果，来自 __getitem__\nprint(bag)        # Bag(3 件物品)，来自 __str__',
    },
  ],
  try: [
    {
      title: '完整的异常处理流程',
      code: 'def divide(a, b):\n    try:\n        return a / b\n    except ZeroDivisionError:\n        return "除数不能为 0"\n    except TypeError:\n        return "参数必须是数字"\n    finally:\n        print("计算结束")       # 必定执行\n\nprint(divide(10, 2))   # 计算结束 → 5.0\nprint(divide(10, 0))   # 计算结束 → 除数不能为 0',
    },
  ],
  with: [
    {
      title: 'with 自动管理文件资源',
      code: '# 不用 with：必须手动 close，异常时可能泄漏\nf = open("/tmp/demo.txt", "w")\nf.write("hello")\nf.close()\n\n# 用 with：离开缩进块自动关闭\nwith open("/tmp/demo.txt") as f:\n    print(f.read())     # hello\n# 此处文件已被自动关闭',
    },
  ],
  import: [
    {
      title: '导入姿势与主程序入口',
      code: 'import math\nfrom random import randint as roll   # from + as 别名\n\nprint(math.pi)     # 3.141592653589793\nprint(roll(1, 6))  # 掷骰子：1~6 的随机整数\n\ndef main():\n    print("作为主程序运行")\n\nif __name__ == "__main__":\n    main()   # 直接运行时执行；被 import 时不执行',
    },
  ],
  precedence: [
    {
      title: '优先级实战验证',
      code: 'print(2 + 3 * 4)         # 14，* 优先于 +\nprint((2 + 3) * 4)       # 20，括号改变优先级\nprint(2 ** 3 ** 2)       # 512，** 右结合 = 2 ** (3 ** 2)\nprint(not True or True)  # True，not 优先于 or\n\nx = 5\nprint(0 < x < 10 and x % 2 == 1)   # True\n# 比较运算 < and，先算完所有比较再做逻辑运算',
    },
  ],
  confusion: [
    {
      title: '两大经典陷阱对照',
      code: '# 陷阱 1：可变默认参数\ndef bad(item, lst=[]):\n    lst.append(item)\n    return lst\n\nprint(bad(1))   # [1]\nprint(bad(2))   # [1, 2] ← 上一次的结果被保留！\n\ndef good(item, lst=None):\n    lst = lst if lst is not None else []\n    lst.append(item)\n    return lst\n\nprint(good(1), good(2))   # [1] [2] ✓\n\n# 陷阱 2：判空写法\nflag = None\nprint(flag == None)   # 能运行但不规范\nprint(flag is None)   # 推荐写法',
    },
  ],
};
