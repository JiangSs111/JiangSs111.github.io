// Python 基础符号与语法知识树
export interface KnowledgeItem {
  symbol: string;
  meaning: string;
  example?: string;
}

export interface KnowledgeNode {
  id: string;
  title: string;
  en: string;
  summary: string;
  map?: string;
  intro?: string;
  tips?: string[];
  items?: KnowledgeItem[];
  children?: KnowledgeNode[];
}

export const ROOT: KnowledgeNode = {
  id: 'root',
  title: 'Python 符号图谱',
  en: 'PYTHON SYNTAX ATLAS',
  summary: '基础符号与语法知识体系',
  children: [
    {
      id: 'ops',
      title: '运算符与赋值',
      en: 'OPERATORS',
      summary: '算术、比较、逻辑、位运算与赋值体系',
      map: '/maps/01_ops.jpg',
      intro:
        '运算符板块需要重点区分三组易混概念：/ 真除法（结果恒为浮点）与 // 整除（向下取整，负数向负无穷方向）；== 值比较与 is 身份比较（判空必须用 is None）；and / or 的短路特性使其返回操作数本身而非布尔值，因此 x or default 成为设置默认值的惯用写法。',
      tips: ['链式比较 0 <= x <= 100 是 Python 特有写法', '记不准优先级时用括号，可读性永远优先'],
      children: [
        {
          id: 'arith',
          title: '算术运算符',
          en: 'ARITHMETIC',
          summary: '+ - * / // % ** @',
          items: [
            { symbol: '+', meaning: '加法', example: '3 + 2  # 5' },
            { symbol: '-', meaning: '减法', example: '3 - 2  # 1' },
            { symbol: '*', meaning: '乘法；也可用于序列重复', example: '"ab" * 3  # "ababab"' },
            { symbol: '/', meaning: '真除法，结果总是浮点数', example: '7 / 2  # 3.5' },
            { symbol: '//', meaning: '整除，向下取整（负数向负无穷）', example: '7 // 2   # 3\n-7 // 2  # -4' },
            { symbol: '%', meaning: '取模（求余数）', example: '7 % 2  # 1' },
            { symbol: '**', meaning: '幂运算', example: '2 ** 10  # 1024' },
            { symbol: '@', meaning: '矩阵乘法（NumPy 等科学计算库）', example: 'A @ B' },
          ],
        },
        {
          id: 'compare',
          title: '比较与成员判断',
          en: 'COMPARISON',
          summary: '== != is in 与链式比较',
          items: [
            { symbol: '==  !=', meaning: '值相等 / 值不等', example: '[1,2] == [1,2]  # True' },
            { symbol: '> < >= <=', meaning: '大小比较，支持链式写法', example: '0 <= x <= 100' },
            { symbol: 'is / is not', meaning: '身份比较，判断是否为同一对象；判空必须用 is None', example: 'a = [1, 2]\nb = [1, 2]\na == b  # True（值相等）\na is b  # False（不同对象）' },
            { symbol: 'in / not in', meaning: '成员判断，适用于字符串、列表、字典等容器', example: '3 in [1, 2, 3]  # True' },
          ],
        },
        {
          id: 'logic',
          title: '逻辑运算符',
          en: 'LOGIC',
          summary: 'and or not 与短路求值',
          items: [
            { symbol: 'and', meaning: '与：前者为假则短路，返回操作数本身', example: '1 and 2  # 2' },
            { symbol: 'or', meaning: '或：前者为真则短路，常用于设置默认值', example: '0 or "default"  # "default"' },
            { symbol: 'not', meaning: '非：取反，返回布尔值', example: 'not []  # True' },
            { symbol: '假值清单', meaning: '布尔判定为 False 的对象', example: 'None  False  0  0.0  ""  []  {}  ()  set()' },
          ],
        },
        {
          id: 'bits',
          title: '位运算符',
          en: 'BITWISE',
          summary: '& | ^ ~ << >>',
          items: [
            { symbol: '&', meaning: '按位与', example: '0b1100 & 0b1010  # 0b1000' },
            { symbol: '|', meaning: '按位或', example: '0b1100 | 0b1010  # 0b1110' },
            { symbol: '^', meaning: '按位异或', example: '0b1100 ^ 0b1010  # 0b0110' },
            { symbol: '~', meaning: '按位取反，~x 等于 -(x+1)', example: '~5  # -6' },
            { symbol: '<<', meaning: '左移，相当于乘 2 的 n 次方', example: '1 << 3  # 8' },
            { symbol: '>>', meaning: '右移，相当于整除 2 的 n 次方', example: '8 >> 2  # 2' },
          ],
        },
        {
          id: 'assign',
          title: '赋值体系',
          en: 'ASSIGNMENT',
          summary: '= += := 与解包',
          items: [
            { symbol: '=', meaning: '基本赋值；可链式赋值', example: 'a = b = c = 0' },
            { symbol: '+= -= *= ...', meaning: '增强赋值，等价于 x = x + 1', example: 'x += 1' },
            { symbol: 'a, b = b, a', meaning: '元组解包，一行交换两个变量', example: 'a, b = 1, 2\na, b = b, a  # 交换' },
            { symbol: '* 解包', meaning: '星号收集剩余元素', example: 'first, *mid, last = [1,2,3,4,5]\n# first=1, mid=[2,3,4], last=5' },
            { symbol: ':=', meaning: '海象运算符（3.8+），在表达式内赋值', example: 'if (n := len(data)) > 10:\n    print(n)' },
            { symbol: 'x: int = 5', meaning: '类型注解，仅作提示，不强制检查', example: 'def add(a: int, b: int) -> int:\n    return a + b' },
          ],
        },
      ],
    },
    {
      id: 'punct',
      title: '标点与结构符号',
      en: 'PUNCTUATION',
      summary: '括号、冒号、逗号、点号与下划线',
      map: '/maps/02_punct.jpg',
      intro:
        '三种括号各有三种以上用途：( ) 用于调用、元组与优先级；[ ] 用于列表、索引切片与类型标注；{ } 用于字典、集合与 f-string 占位。冒号 : 是 Python 的"结构之门"——代码块、切片、字典键值、类型注解全部由它开启。续行首选括号隐式续行而非反斜杠。',
      tips: ['(1) 是数字，(1,) 才是单元素元组', '空字典是 {}，空集合必须用 set()'],
      children: [
        {
          id: 'brackets',
          title: '括号家族',
          en: 'BRACKETS',
          summary: '( ) [ ] { } 的多重身份',
          items: [
            { symbol: '( )', meaning: '函数调用 / 元组 / 改变运算优先级', example: 'print("hi")\nt = (1, 2, 3)\n(1 + 2) * 3' },
            { symbol: '(1,)', meaning: '单元素元组必须带逗号', example: '(1)   # 数字 1\n(1,)  # 元组' },
            { symbol: '[ ]', meaning: '列表 / 索引切片 / 类型标注', example: 'lst = [1, 2, 3]\nlst[1:3]\nlist[int]' },
            { symbol: '{ }', meaning: '字典 / 集合 / f-string 占位符', example: '{"a": 1}\n{1, 2, 3}\nf"{name}"' },
          ],
        },
        {
          id: 'colon',
          title: '冒号 :',
          en: 'COLON',
          summary: '代码块、切片、键值与注解',
          items: [
            { symbol: '代码块', meaning: 'if / for / while / def / class / with / try 之后开启缩进块', example: 'if x > 0:\n    pass' },
            { symbol: '切片', meaning: 'seq[start:stop:step]，左闭右开', example: 's = "hello"\ns[1:4]   # "ell"\ns[::-1]  # "olleh" 反转' },
            { symbol: '键值分隔', meaning: '字典字面量中的 key: value', example: 'd = {"key": "value"}' },
            { symbol: '类型注解', meaning: '标注参数、返回值与变量类型', example: 'def f(x: int) -> str: ...' },
          ],
        },
        {
          id: 'comma',
          title: '逗号与分号',
          en: 'COMMA & SEMICOLON',
          summary: ', 分隔与 ; 一行多句',
          items: [
            { symbol: ',', meaning: '分隔元素与参数；可隐式创建元组', example: 't = 1, 2, 3  # 等价 (1, 2, 3)' },
            { symbol: ';', meaning: '一行写多条语句（不推荐，违反 PEP8）', example: 'a = 1; b = 2' },
            { symbol: 'sep / end', meaning: 'print 的分隔符与结束符参数', example: 'print("a", "b", sep="-")  # a-b' },
          ],
        },
        {
          id: 'dot',
          title: '点号与续行',
          en: 'DOT & CONTINUATION',
          summary: '. 成员访问与 \\ 续行',
          items: [
            { symbol: '.', meaning: '访问模块成员、对象方法与属性', example: 'import math\nmath.sqrt(16)\n"abc".upper()' },
            { symbol: '\\', meaning: '反斜杠显式续行', example: 'total = 1 + 2 + \\\n        3 + 4' },
            { symbol: '( ) 续行', meaning: '括号内可自由换行，是首选的续行方式', example: 'total = (1 + 2 +\n         3 + 4)' },
          ],
        },
        {
          id: 'underscore',
          title: '省略号与下划线',
          en: 'ELLIPSIS & UNDERSCORE',
          summary: '... 占位与 _ 的七种身份',
          items: [
            { symbol: '...', meaning: '函数体占位（等价 pass）/ NumPy 剩余维度', example: 'def todo(): ...\narr[..., 0]' },
            { symbol: '_', meaning: '丢弃不用的变量', example: 'for _ in range(3):\n    retry()' },
            { symbol: '1_000_000', meaning: '数字字面量分隔符，增强可读性', example: 'salary = 1_000_000' },
            { symbol: 'name_', meaning: '后缀下划线，避开关键字', example: 'class_ = "A班"' },
            { symbol: '_internal', meaning: '约定"内部使用"，import * 不导出', example: 'self._cache = {}' },
            { symbol: '__private', meaning: '类中触发名称改写 _ClassName__private', example: 'self.__secret = 1' },
          ],
        },
      ],
    },
    {
      id: 'string',
      title: '字符串与注释',
      en: 'STRINGS',
      summary: '引号、转义、前缀、格式化与注释',
      map: '/maps/03_string.jpg',
      intro:
        '字符串的单双引号完全等价，三引号承担多行文本与文档字符串双重职责。前缀字母改变字符串的解释方式：f 开启插值格式化（3.6+，首选）、r 关闭转义（正则与路径必备）、b 生成字节串。注释方面，# 为单行注释，文档字符串写在模块、类、函数开头，可被 help() 读取。',
      tips: ['路径与正则一律用 r 前缀', '新代码统一使用 f-string'],
      children: [
        {
          id: 'quotes',
          title: '引号体系',
          en: 'QUOTES',
          summary: '单双引号与三引号',
          items: [
            { symbol: "' ' 与 \" \"", meaning: '单双引号完全等价，可互相嵌套', example: 's1 = \'hello\'\ns2 = "hello"' },
            { symbol: "''' '''", meaning: '三引号：多行字符串，兼作文档字符串', example: 's = """多行\n字符串"""' },
          ],
        },
        {
          id: 'escape',
          title: '转义与前缀',
          en: 'ESCAPE & PREFIX',
          summary: '\\ 转义与 r f b 前缀',
          items: [
            { symbol: '\\n  \\t  \\\\', meaning: '换行、制表符、反斜杠本身', example: 'print("a\\tb")' },
            { symbol: "r' '", meaning: '原始字符串，不处理转义（正则、路径常用）', example: 'r"C:\\path\\file"' },
            { symbol: "b' '", meaning: '字节串，用于二进制数据', example: 'b"bytes"' },
            { symbol: "f' '", meaning: '格式化字符串字面量（3.6+）', example: 'f"{name} 今年 {age} 岁"' },
          ],
        },
        {
          id: 'format',
          title: '格式化三方式',
          en: 'FORMATTING',
          summary: 'f-string / format / %',
          items: [
            { symbol: 'f-string', meaning: '首选方式，支持精度、对齐、宽度控制', example: 'f"{pi:.2f}"     # 两位小数\nf"{value:>10}"  # 右对齐宽 10' },
            { symbol: '.format()', meaning: '方法式格式化', example: '"我叫{}".format(name)' },
            { symbol: '% 旧式', meaning: 'C 风格格式化，新代码不推荐', example: '"%s 今年 %d 岁" % (name, age)' },
            { symbol: '+ 与 *', meaning: '字符串拼接与重复', example: '"ab" * 3  # "ababab"' },
          ],
        },
        {
          id: 'comment',
          title: '注释与文档字符串',
          en: 'COMMENTS',
          summary: '# 注释与 docstring',
          items: [
            { symbol: '#', meaning: '单行注释', example: '# 这是注释' },
            { symbol: 'docstring', meaning: '模块 / 类 / 函数开头的说明字符串，help() 可读取', example: 'def add(a, b):\n    """计算两数之和。"""\n    return a + b' },
            { symbol: 'TODO / FIXME', meaning: '待办与待修复标记，IDE 会自动识别', example: '# TODO: 补充边界处理' },
          ],
        },
      ],
    },
  ],
};

export const EXTRA: KnowledgeNode[] = [
  {
    id: 'special',
    title: '特殊语法符号',
    en: 'SPECIAL SYNTAX',
    summary: '星号解包、装饰器、类型注解与海象运算符',
    map: '/maps/04_special.jpg',
    intro:
      '本板块是 Python 语法进阶的核心：* 与 ** 在函数定义中收集参数、在调用处解包、在字面量中合并序列与字典；@ 装饰器本质是"函数包装函数"的语法糖；-> 与 | 构成现代类型注解体系（3.10+ 的 int | str 取代 Union）；:= 海象运算符允许在表达式内部完成赋值，减少重复计算。',
    tips: ['参数顺序：普通参数 → *args → 仅限关键字 → **kwargs', '类型注解不参与运行时检查'],
    children: [
      {
        id: 'star',
        title: '星号 * 与 **',
        en: 'STAR OPERATORS',
        summary: '参数收集、解包与合并',
        items: [
          { symbol: '*args', meaning: '函数定义中收集多余位置参数为元组', example: 'def f(*args):\n    print(args)  # 元组' },
          { symbol: '**kwargs', meaning: '收集多余关键字参数为字典', example: 'def f(**kw):\n    print(kw)  # 字典' },
          { symbol: 'def f(a, *, b)', meaning: '* 之后的参数仅限关键字传参', example: 'f(1, b=2)' },
          { symbol: 'def f(a, /, b)', meaning: '/ 之前的参数仅限位置传参（3.8+）', example: 'f(1, 2)' },
          { symbol: '调用处解包', meaning: '* 展开序列，** 展开字典', example: 'print(*[1, 2, 3])\nf(**{"a": 1})' },
          { symbol: '字面量合并', meaning: '在列表 / 字典字面量中解包合并', example: '[*a, *b]\n{**d1, **d2}' },
        ],
      },
      {
        id: 'decorator',
        title: '装饰器 @',
        en: 'DECORATORS',
        summary: '@ 语法糖与常用内置装饰器',
        items: [
          { symbol: '@log', meaning: '装饰器本质是函数包装：等价于 say = log(say)', example: '@log\ndef say():\n    print("hi")' },
          { symbol: '@staticmethod', meaning: '静态方法，不需要 self 或 cls', example: '@staticmethod\ndef sm(): ...' },
          { symbol: '@classmethod', meaning: '类方法，首参为 cls', example: '@classmethod\ndef cm(cls): ...' },
          { symbol: '@property', meaning: '把方法变成属性式访问', example: '@property\ndef value(self):\n    return self._v' },
          { symbol: '其他常见', meaning: '标准库与第三方高频装饰器', example: '@dataclass  @lru_cache  @abstractmethod' },
        ],
      },
      {
        id: 'typing',
        title: '类型注解符号',
        en: 'TYPE HINTS',
        summary: '-> 与 | 联合类型',
        items: [
          { symbol: '->', meaning: '返回值类型注解', example: 'def greet(name: str) -> str:\n    return f"Hello, {name}"' },
          { symbol: 'int | str', meaning: '联合类型（3.10+），取代 Union[int, str]', example: 'def f(x: int | str): ...' },
          { symbol: 'int | None', meaning: '可选类型，取代 Optional[int]', example: 'def find() -> int | None: ...' },
        ],
      },
      {
        id: 'walrus',
        title: '海象运算符 :=',
        en: 'WALRUS',
        summary: '表达式内赋值（3.8+）',
        items: [
          { symbol: 'if 中赋值', meaning: '避免重复计算，条件内直接使用结果', example: 'if (n := len(data)) > 3:\n    print(n)' },
          { symbol: '推导式中复用', meaning: '让昂贵的计算只执行一次', example: '[y for x in data if (y := x * x) > 10]' },
        ],
      },
    ],
  },
  {
    id: 'flow',
    title: '控制流与推导式',
    en: 'CONTROL FLOW',
    summary: '条件、循环、match 与四大推导式',
    map: '/maps/05_flow.jpg',
    intro:
      'Python 用缩进而非大括号划分代码块，这是其最鲜明的符号特征。条件表达式 "A if 条件 else B" 取代了三目运算符；3.10 引入的 match / case 提供了结构化模式匹配；for...else 的 else 在循环未被 break 时执行。推导式是 Python 的招牌语法，列表、字典、集合、生成器四种形式覆盖绝大多数映射与过滤场景。',
    tips: ['推导式优于 append 循环', '生成器表达式处理大数据更省内存'],
    children: [
      {
        id: 'branch',
        title: '条件分支',
        en: 'BRANCHING',
        summary: 'if / elif / else 与三元式',
        items: [
          { symbol: 'if / elif / else', meaning: '条件分支，缩进划分代码块', example: 'if score >= 90:\n    grade = "A"\nelif score >= 60:\n    grade = "B"\nelse:\n    grade = "C"' },
          { symbol: '三元表达式', meaning: '单行条件取值', example: '"及格" if score >= 60 else "不及格"' },
          { symbol: 'match / case', meaning: '结构化模式匹配（3.10+），_ 为通配符', example: 'match command.split():\n    case ["go", d]:\n        move(d)\n    case _:\n        print("未知命令")' },
        ],
      },
      {
        id: 'loop',
        title: '循环',
        en: 'LOOPS',
        summary: 'for / while 与循环控制',
        items: [
          { symbol: 'for ... in', meaning: '遍历可迭代对象', example: 'for i in range(5):\n    print(i)' },
          { symbol: 'while', meaning: '条件循环', example: 'while x > 0:\n    x -= 1' },
          { symbol: 'break / continue', meaning: '跳出循环 / 跳过本轮', example: 'if i == 4:\n    break' },
          { symbol: 'for...else', meaning: 'else 在循环未被 break 时执行', example: 'for x in lst:\n    if found: break\nelse:\n    print("未找到")' },
          { symbol: 'enumerate / zip', meaning: '带索引遍历 / 并行遍历', example: 'for i, v in enumerate(lst, 1): ...\nfor a, b in zip(l1, l2): ...' },
        ],
      },
      {
        id: 'comprehension',
        title: '四大推导式',
        en: 'COMPREHENSIONS',
        summary: '列表、字典、集合与生成器',
        items: [
          { symbol: '列表推导式', meaning: '映射与过滤的一站式语法', example: '[x ** 2 for x in range(10) if x % 2 == 0]' },
          { symbol: '字典推导式', meaning: '快速构建字典', example: '{k: v for k, v in enumerate("abc")}' },
          { symbol: '集合推导式', meaning: '构建去重集合', example: '{x % 3 for x in range(10)}' },
          { symbol: '生成器表达式', meaning: '惰性求值，节省内存', example: 'sum(x * x for x in range(10 ** 8))' },
          { symbol: 'pass', meaning: '空语句占位', example: 'def empty():\n    pass' },
        ],
      },
    ],
  },
];

export const EXTRA2: KnowledgeNode[] = [
  {
    id: 'oop',
    title: '函数与面向对象',
    en: 'FUNCTIONS & OOP',
    summary: '参数体系、lambda、生成器、类与魔术方法',
    map: '/maps/06_oop.jpg',
    intro:
      '函数参数顺序为：位置参数、*args、仅限关键字参数、**kwargs；可变默认参数是经典陷阱，应以 None 占位再在函数体内初始化。lambda 只能写单个表达式。类体系中，self 是实例方法的第一个参数，双下划线前缀触发名称改写，魔术方法（__init__、__str__、__len__ 等）让自定义对象融入 Python 的内置语法。',
    tips: ['可变默认参数用 None 代替', '魔术方法让对象支持内置语法'],
    children: [
      {
        id: 'funcdef',
        title: '函数定义与参数',
        en: 'PARAMETERS',
        summary: 'def 参数体系与返回值',
        items: [
          { symbol: 'def', meaning: '函数定义，可带类型注解', example: 'def add(a: int, b: int = 0) -> int:\n    return a + b' },
          { symbol: '参数顺序', meaning: '位置参数 → *args → 仅限关键字 → **kwargs', example: 'def f(a, /, b, *args, c, **kw): ...' },
          { symbol: '默认参数陷阱', meaning: '可变对象作默认值会跨调用共享', example: 'def good(item, lst=None):\n    if lst is None:\n        lst = []' },
          { symbol: '多返回值', meaning: '实为返回元组，可自动解包', example: 'def min_max(lst):\n    return min(lst), max(lst)\nlo, hi = min_max([3, 1, 4])' },
        ],
      },
      {
        id: 'lambda',
        title: 'lambda 与生成器',
        en: 'LAMBDA & GENERATOR',
        summary: '匿名函数与 yield',
        items: [
          { symbol: 'lambda', meaning: '单表达式匿名函数，常作 key 参数', example: 'square = lambda x: x ** 2\nsorted(data, key=lambda d: d["age"])' },
          { symbol: 'yield', meaning: '生成器函数：每次产出一个值并挂起状态', example: 'def count(n):\n    i = 1\n    while i <= n:\n        yield i\n        i += 1' },
        ],
      },
      {
        id: 'class',
        title: '类与继承',
        en: 'CLASSES',
        summary: 'class、self、super 与下划线约定',
        items: [
          { symbol: 'class', meaning: '类定义；括号内写父类实现继承', example: 'class Dog(Animal):\n    def speak(self):\n        return "汪汪"' },
          { symbol: '__init__ / self', meaning: '构造方法与实例自身引用', example: 'def __init__(self, name):\n    self.name = name' },
          { symbol: 'super()', meaning: '调用父类方法', example: 'super().__init__(name)' },
          { symbol: '类属性 vs 实例属性', meaning: '类属性所有实例共享', example: 'class A:\n    species = "动物"  # 类属性' },
          { symbol: '@dataclass', meaning: '自动生成 __init__、__repr__ 等样板（3.7+）', example: '@dataclass\nclass Point:\n    x: float\n    y: float' },
        ],
      },
      {
        id: 'magic',
        title: '魔术方法',
        en: 'DUNDER METHODS',
        summary: '__xxx__ 让对象融入内置语法',
        items: [
          { symbol: '__str__ / __repr__', meaning: 'print / 交互式环境下的字符串表示', example: 'def __str__(self):\n    return f"A({self.name})"' },
          { symbol: '__len__', meaning: '支持 len(obj)', example: 'def __len__(self):\n    return len(self.items)' },
          { symbol: '__getitem__', meaning: '支持 obj[i] 下标访问', example: 'def __getitem__(self, i):\n    return self.data[i]' },
          { symbol: '__eq__', meaning: '自定义 == 比较逻辑', example: 'def __eq__(self, other):\n    return self.id == other.id' },
          { symbol: '__call__', meaning: '让实例可以像函数一样被调用', example: 'def __call__(self, x):\n    return x * 2' },
          { symbol: '__enter__ / __exit__', meaning: '支持 with 语句', example: 'def __enter__(self):\n    return self' },
        ],
      },
    ],
  },
  {
    id: 'exception',
    title: '异常与模块',
    en: 'EXCEPTIONS & MODULES',
    summary: 'try 体系、with 上下文与 import',
    intro:
      '异常处理采用 try / except / else / finally 四段结构：else 在无异常时执行，finally 无论是否异常都执行，常用于资源释放。with 语句借助上下文管理协议自动关闭资源。模块通过 import 组织，if __name__ == "__main__": 区分"直接运行"与"被导入"两种身份。',
    children: [
      {
        id: 'try',
        title: '异常处理',
        en: 'TRY / EXCEPT',
        summary: '四段结构与 raise',
        items: [
          { symbol: 'try / except', meaning: '捕获特定异常，as 绑定异常对象', example: 'try:\n    r = 10 / x\nexcept ZeroDivisionError as e:\n    print(e)' },
          { symbol: '多异常捕获', meaning: '元组形式同时捕获多种异常', example: 'except (TypeError, ValueError):' },
          { symbol: 'else / finally', meaning: '无异常时执行 / 必定执行', example: 'else:\n    print("成功")\nfinally:\n    f.close()' },
          { symbol: 'raise', meaning: '主动抛出异常，from 形成异常链', example: 'raise ValueError("年龄不能为负")' },
          { symbol: '自定义异常', meaning: '继承 Exception', example: 'class MyError(Exception):\n    pass' },
        ],
      },
      {
        id: 'with',
        title: '上下文管理',
        en: 'WITH STATEMENT',
        summary: 'with ... as 自动管理资源',
        items: [
          { symbol: 'with ... as', meaning: '离开缩进块自动关闭资源', example: 'with open("data.txt", encoding="utf-8") as f:\n    content = f.read()' },
          { symbol: '多上下文', meaning: '一行管理多个资源', example: 'with open("a") as fa, open("b") as fb:\n    pass' },
        ],
      },
      {
        id: 'import',
        title: '模块导入',
        en: 'IMPORTS',
        summary: 'import 体系与主程序入口',
        items: [
          { symbol: 'import', meaning: '导入整个模块', example: 'import math\nmath.pi' },
          { symbol: 'from ... import', meaning: '导入指定成员', example: 'from os import path' },
          { symbol: 'as', meaning: '别名导入', example: 'import numpy as np' },
          { symbol: '__main__', meaning: '主程序入口：直接运行时执行，被导入时不执行', example: 'if __name__ == "__main__":\n    main()' },
        ],
      },
    ],
  },
  {
    id: 'appendix',
    title: '附录：优先级与易混淆',
    en: 'APPENDIX',
    summary: '运算符优先级速记与易混淆点辨析',
    intro:
      '运算符优先级由高到低大致为：** → 一元 ±~ → * / // % → + - → << >> → & ^ | → 比较与成员判断 → not → and → or → 三元表达式 → :=。记不准时直接使用括号，可读性永远优先。',
    children: [
      {
        id: 'precedence',
        title: '运算符优先级',
        en: 'PRECEDENCE',
        summary: '由高到低速记',
        items: [
          { symbol: '第 1 梯队', meaning: '幂运算（右结合）', example: '**' },
          { symbol: '第 2 梯队', meaning: '一元正负与取反', example: '+x  -x  ~x' },
          { symbol: '第 3 梯队', meaning: '乘除类', example: '*  @  /  //  %' },
          { symbol: '第 4 梯队', meaning: '加减与移位', example: '+  -  <<  >>' },
          { symbol: '第 5 梯队', meaning: '位运算三兄弟', example: '&  ^  |' },
          { symbol: '第 6 梯队', meaning: '比较与成员判断', example: '==  !=  <  >  is  in' },
          { symbol: '第 7 梯队', meaning: '逻辑运算与三元、海象', example: 'not → and → or → if-else → :=' },
        ],
      },
      {
        id: 'confusion',
        title: '易混淆点辨析',
        en: 'COMMON PITFALLS',
        summary: '八组最易混淆的概念',
        items: [
          { symbol: '= / == / is', meaning: '赋值 / 值相等 / 同一对象', example: '判空必须用 is None' },
          { symbol: '/ 与 //', meaning: '真除法得浮点 / 整除向下取整', example: '-7 // 2  # -4' },
          { symbol: '(1) 与 (1,)', meaning: '数字 1 / 单元素元组', example: 't = (1,)' },
          { symbol: 'and / or 返回值', meaning: '返回操作数本身，不一定是布尔值', example: '0 or "d"  # "d"' },
          { symbol: '可变默认参数', meaning: '默认列表跨调用共享', example: 'def f(lst=None):' },
          { symbol: '浅拷贝 / 深拷贝', meaning: 'copy 只拷外层 / deepcopy 递归拷贝', example: 'import copy\ncopy.deepcopy(d)' },
          { symbol: '+ 与 append', meaning: '拼接产生新列表 / 就地修改', example: '循环内用 append 更高效' },
          { symbol: '== None', meaning: '违背惯例的判空写法', example: '一律写 is None' },
        ],
      },
    ],
  },
];

ROOT.children = [...(ROOT.children ?? []), ...EXTRA, ...EXTRA2];

export function findNode(path: string[]): KnowledgeNode | null {
  let node: KnowledgeNode = ROOT;
  for (const id of path) {
    const next = node.children?.find((c) => c.id === id);
    if (!next) return null;
    node = next;
  }
  return node;
}
