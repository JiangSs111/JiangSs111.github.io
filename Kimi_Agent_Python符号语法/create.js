import fs from "node:fs";
import path from "node:path";
import {
  AlignmentType, Document, Footer, Header, HeadingLevel, ImageRun,
  ImportedXmlComponent, Packer, PageBreak, PageNumber, Paragraph,
  ShadingType, Table, TableCell, TableRow, TextRun, WidthType,
  convertInchesToTwip,
} from "docx";

const outputPath = process.argv[2];
if (!outputPath) throw new Error("Usage: node create.js /absolute/path/output.docx");
const outputDir = path.dirname(outputPath);
const assetDir = path.join(outputDir, "assets");

const T = String.raw;
const docTitle = T`Python 基础符号与语法知识体系`;
const palette = {
  dark: "2F4858", primary: "3E5C76", light: "7A8B99",
  border: "D8E0E3", fill: "EEF3F6", code: "F5F2EA",
};

const font = { ascii: "Times New Roman", hAnsi: "Times New Roman", cs: "Times New Roman", eastAsia: "SimSun" };
const codeFont = { ascii: "Consolas", hAnsi: "Consolas", cs: "Consolas", eastAsia: "SimSun" };

const run = (text, options = {}) => new TextRun({ text, font, size: 24, ...options });
const codeRun = (text, options = {}) => new TextRun({ text, font: codeFont, size: 22, ...options });
const para = (children, options = {}) => new Paragraph({
  spacing: { after: 160, line: 300 }, ...options,
  children: Array.isArray(children) ? children : [children],
});
const bodyPara = (text) => para(run(text), { indent: { firstLine: convertInchesToTwip(0.33) } });
const heading = (text, level = 1) =>
  para(run(text, { bold: true, size: level === 1 ? 32 : 27, color: palette.dark }), {
    heading: level === 1 ? HeadingLevel.HEADING_1 : HeadingLevel.HEADING_2,
    spacing: { before: 200, after: 160 },
  });
const pageBreak = () => new Paragraph({ children: [new PageBreak()] });

const img = (file, width, naturalW, naturalH) => {
  const height = Math.round((width * naturalH) / naturalW);
  return para(new ImageRun({
    type: "png",
    data: fs.readFileSync(path.join(assetDir, file)),
    transformation: { width, height },
  }), { alignment: AlignmentType.CENTER, spacing: { after: 120 } });
};
const caption = (text) => para(run(text, { italics: true, size: 20, color: palette.light }),
  { alignment: AlignmentType.CENTER, spacing: { after: 240 } });

// ---------- 表格 ----------
const colW = [1800, 4026, 3200];
const cell = (children, options = {}) => new TableCell({
  children: Array.isArray(children) ? children : [children],
  margins: { top: 100, bottom: 100, left: 120, right: 120 },
  ...options,
});
const tHead = (texts) => new TableRow({
  tableHeader: true,
  children: texts.map((t, i) => cell(
    para(run(t, { bold: true, size: 22, color: "FFFFFF" }), { alignment: AlignmentType.CENTER, spacing: { after: 0, line: 280 } }),
    { shading: { type: ShadingType.CLEAR, fill: palette.primary }, width: { size: colW[i], type: WidthType.DXA } })),
});
const tRow = (cells, even) => new TableRow({
  children: cells.map((c, i) => {
    const isCode = i !== 1 && /[+\-*/%=<>|&^~@#:()[\]{},._;'"\\]/.test(c);
    const content = para(isCode ? codeRun(c, { size: 20 }) : run(c, { size: 22 }),
      { spacing: { after: 0, line: 280 } });
    return cell(content, {
      width: { size: colW[i], type: WidthType.DXA },
      ...(even ? { shading: { type: ShadingType.CLEAR, fill: palette.fill } } : {}),
    });
  }),
});
const makeTable = (headers, rows) => new Table({
  width: { size: colW.reduce((a, b) => a + b, 0), type: WidthType.DXA },
  columnWidths: colW,
  rows: [tHead(headers), ...rows.map((r, i) => tRow(r, i % 2 === 1))],
});

// ---------- 目录 ----------
const xmlEscape = (v) => String(v).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const toc = (entries) => {
  const cached = entries.map(({ title, level, page }) => {
    const indent = Math.max(0, level - 1) * 360;
    return `<w:p><w:pPr><w:pStyle w:val="TOC${level}"/>
      <w:tabs><w:tab w:val="right" w:leader="dot" w:pos="9000"/></w:tabs>
      <w:ind w:left="${indent}"/></w:pPr>
      <w:r><w:t>${xmlEscape(title)}</w:t></w:r><w:r><w:tab/></w:r><w:r><w:t>${page}</w:t></w:r></w:p>`;
  }).join("");
  return ImportedXmlComponent.fromXmlString(`<w:sdt xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:sdtPr><w:alias w:val="目录"/></w:sdtPr><w:sdtContent>
      <w:p><w:r><w:fldChar w:fldCharType="begin" w:dirty="true"/>
        <w:instrText xml:space="preserve"> TOC \\o &quot;1-2&quot; \\h \\z \\u </w:instrText>
        <w:fldChar w:fldCharType="separate"/></w:r></w:p>
      ${cached}
      <w:p><w:r><w:fldChar w:fldCharType="end"/></w:r></w:p>
    </w:sdtContent></w:sdt>`).root[0];
};

// ================= 章节数据 =================
const chapters = [
  {
    title: T`一、知识总览`,
    page: 3,
    image: { file: "00_overview.png", w: 470, nw: 3120, nh: 4596 },
    caption: T`图 1  Python 基础符号与语法体系总览`,
    intro: T`Python 的符号体系可分为七大板块：运算符与赋值、标点与结构符号、字符串与注释、特殊语法符号、控制流与推导式、函数与面向对象、异常与模块。每个符号往往身兼数职，例如 * 既是乘法也是参数收集与解包，: 既引导代码块也用于切片与注解。理解符号的全部语境，是写出地道 Python 代码的前提。`,
    table: null,
  },
  {
    title: T`二、运算符与赋值`,
    page: 4,
    image: { file: "01_ops.png", w: 460, nw: 3120, nh: 4376 },
    caption: T`图 2  运算符与赋值体系`,
    intro: T`运算符板块需要重点区分三组易混概念：/ 真除法（结果恒为浮点）与 // 整除（向下取整，负数向负无穷取整）；== 值比较与 is 身份比较（判空必须用 is None）；and / or 的短路特性使其返回操作数本身而非布尔值，因此 x or default 成为设置默认值的惯用写法。`,
    table: {
      headers: ["符号", "含义", "示例"],
      rows: [
        [T`+ - * /`, T`加减乘除，/ 恒得浮点`, T`7 / 2 → 3.5`],
        [T`// %`, T`整除（向下取整）、取模`, T`-7 // 2 → -4`],
        [T`**`, T`幂运算`, T`2 ** 10 → 1024`],
        [T`== != < >`, T`值比较，支持链式`, T`0 <= x <= 100`],
        [T`is / in`, T`身份比较 / 成员判断`, T`a is None；3 in lst`],
        [T`and or not`, T`逻辑运算，短路求值`, T`x or "default"`],
        [T`& | ^ ~ << >>`, T`位运算`, T`1 << 3 → 8`],
        [T`= += :=`, T`赋值 / 增强赋值 / 海象`, T`a, b = b, a`],
      ],
    },
  },
  {
    title: T`三、标点与结构符号`,
    page: 6,
    image: { file: "02_punct.png", w: 460, nw: 3120, nh: 3990 },
    caption: T`图 3  标点与结构符号体系`,
    intro: T`三种括号各有三种以上用途：( ) 用于调用、元组与优先级；[ ] 用于列表、索引切片与类型标注；{ } 用于字典、集合与 f-string 占位。冒号 : 是 Python 的"结构之门"——代码块、切片、字典键值、类型注解全部由它开启。续行首选括号隐式续行而非反斜杠。`,
    table: {
      headers: ["符号", "含义", "示例"],
      rows: [
        [T`( )`, T`调用 / 元组 / 优先级`, T`(1,) 单元素元组`],
        [T`[ ]`, T`列表 / 索引切片`, T`s[::-1] 反转`],
        [T`{ }`, T`字典 / 集合 / 占位符`, T`{"k": 1}；f"{x}"`],
        [T`:`, T`代码块 / 切片 / 注解`, T`seq[1:4]；x: int`],
        [T`,`, T`分隔 / 隐式元组`, T`t = 1, 2, 3`],
        [T`.`, T`属性与方法访问`, T`"abc".upper()`],
        [T`...`, T`占位 / NumPy 维度省略`, T`def f(): ...`],
        [T`_`, T`丢弃变量 / 私有约定`, T`1_000_000；_tmp`],
      ],
    },
  },
  {
    title: T`四、字符串与注释`,
    page: 8,
    image: { file: "03_string.png", w: 470, nw: 3120, nh: 3260 },
    caption: T`图 4  字符串与注释体系`,
    intro: T`字符串的单双引号完全等价，三引号承担多行文本与文档字符串双重职责。前缀字母改变字符串的解释方式：f 开启插值格式化（3.6+，首选）、r 关闭转义（正则与路径必备）、b 生成字节串。注释方面，# 为单行注释，文档字符串写在模块、类、函数的开头，可被 help() 读取。`,
    table: {
      headers: ["符号", "含义", "示例"],
      rows: [
        [T`' ' " "`, T`单双引号，完全等价`, T`s = "hello"`],
        [T`''' '''`, T`多行字符串 / docstring`, T`"""说明文档"""`],
        ["\\", T`转义字符`, T`\n 换行、\t 制表符`],
        [T`r''`, T`原始字符串，不转义`, T`r"C:\path"`],
        [T`f''`, T`插值格式化（推荐）`, T`f"{pi:.2f}"`],
        [T`b''`, T`字节串`, T`b"data"`],
        [T`#`, T`单行注释`, T`# 注释内容`],
      ],
    },
  },
  {
    title: T`五、特殊语法符号`,
    page: 10,
    image: { file: "04_special.png", w: 470, nw: 3120, nh: 3508 },
    caption: T`图 5  特殊语法符号体系`,
    intro: T`本板块是 Python 语法进阶的核心：* 与 ** 在函数定义中收集参数、在调用处解包、在字面量中合并序列与字典；@ 装饰器本质是函数包装函数的语法糖；-> 与 | 构成现代类型注解体系（3.10+ 的 int | str 取代 Union）；:= 海象运算符允许在表达式内部完成赋值，减少重复计算。`,
    table: {
      headers: ["符号", "含义", "示例"],
      rows: [
        [T`*args`, T`收集多余位置参数为元组`, T`def f(*args):`],
        [T`**kwargs`, T`收集多余关键字参数为字典`, T`def f(**kw):`],
        [T`* /`, T`仅限关键字 / 仅限位置传参`, T`def f(a, /, b, *, c):`],
        [T`* 解包`, T`序列 / 字典展开`, T`[*a, *b]；{**d1, **d2}`],
        [T`@`, T`装饰器`, T`@property；@dataclass`],
        [T`->`, T`返回值类型注解`, T`def f() -> int:`],
        [T`:=`, T`海象运算符（3.8+）`, T`if (n := len(d)) > 3:`],
        [T`|`, T`字典合并 / 类型联合`, T`d1 | d2；int | None`],
      ],
    },
  },
  {
    title: T`六、控制流与推导式`,
    page: 12,
    image: { file: "05_flow.png", w: 480, nw: 3120, nh: 3012 },
    caption: T`图 6  控制流与推导式体系`,
    intro: T`Python 用缩进而非大括号划分代码块，这是其最鲜明的符号特征。条件表达式 "A if 条件 else B" 取代了三目运算符；3.10 引入的 match/case 提供了结构化模式匹配；for...else 的 else 在循环未被 break 时执行。推导式是 Python 的招牌语法，列表、字典、集合、生成器四种形式覆盖绝大多数映射与过滤场景。`,
    table: {
      headers: ["语法", "含义", "示例"],
      rows: [
        [T`if / elif / else`, T`条件分支，缩进成块`, T`if x > 0:`],
        [T`三元表达式`, T`单行条件取值`, T`"及格" if s >= 60 else "不及格"`],
        [T`match / case`, T`模式匹配（3.10+）`, T`case ["go", d]:`],
        [T`for / while`, T`循环；else 未被 break 才执行`, T`for i, v in enumerate(lst):`],
        [T`break / continue`, T`跳出 / 跳过`, T`continue`],
        [T`推导式`, T`映射过滤的一站式语法`, T`[x**2 for x in range(10)]`],
        [T`( ) 生成器式`, T`惰性求值，省内存`, T`sum(x*x for x in big)`],
      ],
    },
  },
  {
    title: T`七、函数与面向对象`,
    page: 14,
    image: { file: "06_oop.png", w: 465, nw: 3120, nh: 3756 },
    caption: T`图 7  函数与面向对象体系`,
    intro: T`函数参数顺序为：位置参数、*args、仅限关键字参数、**kwargs；可变默认参数是经典陷阱，应以 None 占位再在函数体内初始化。lambda 只能写单个表达式。类体系中，self 是实例方法的第一个参数，双下划线前缀触发名称改写，魔术方法（__init__、__str__、__len__ 等）让自定义对象融入 Python 的内置语法。`,
    table: {
      headers: ["语法", "含义", "示例"],
      rows: [
        [T`def`, T`函数定义`, T`def add(a, b=0):`],
        [T`lambda`, T`单表达式匿名函数`, T`key=lambda x: x[1]`],
        [T`yield`, T`生成器函数`, T`yield i`],
        [T`class`, T`类定义与继承`, T`class Dog(Animal):`],
        [T`self`, T`实例方法首参`, T`def speak(self):`],
        [T`__x__`, T`魔术方法`, T`__init__；__str__；__len__`],
        [T`@property`, T`方法转属性式访问`, T`@property`],
        [T`@dataclass`, T`自动生成样板方法`, T`@dataclass`],
      ],
    },
  },
  {
    title: T`八、异常与模块`,
    page: 16,
    image: null,
    caption: null,
    intro: T`异常处理采用 try / except / else / finally 四段结构：else 在无异常时执行，finally 无论是否异常都执行，常用于资源释放。with 语句借助上下文管理协议（__enter__ / __exit__）自动关闭资源。模块通过 import 组织，if __name__ == "__main__": 区分"直接运行"与"被导入"两种身份。`,
    table: {
      headers: ["语法", "含义", "示例"],
      rows: [
        [T`try / except`, T`捕获异常`, T`except ValueError as e:`],
        [T`else / finally`, T`无异常时 / 必执行`, T`finally: f.close()`],
        [T`raise`, T`主动抛出异常`, T`raise ValueError("msg")`],
        [T`with ... as`, T`上下文管理`, T`with open(p) as f:`],
        [T`import / from`, T`模块导入`, T`from os import path`],
        [T`as`, T`别名`, T`import numpy as np`],
        [T`__main__`, T`主程序入口判断`, T`if __name__ == "__main__":`],
      ],
    },
  },
  {
    title: T`九、附录：优先级与易混淆点`,
    page: 17,
    image: null,
    caption: null,
    intro: T`运算符优先级由高到低大致为：** → 一元 ±~ → * / // % → + - → << >> → & ^ | → 比较与成员判断 → not → and → or → 三元表达式 → :=。记不准时直接使用括号，可读性永远优先。下表列出最易混淆的八组概念。`,
    table: {
      headers: ["易混淆", "区别", "正确做法"],
      rows: [
        [T`= / == / is`, T`赋值 / 值相等 / 同一对象`, T`判空用 is None`],
        [T`/ 与 //`, T`真除法得浮点 / 整除向下取整`, T`-7 // 2 → -4`],
        [T`(1) 与 (1,)`, T`数字 / 单元素元组`, T`元组必须带逗号`],
        [T`and / or 返回值`, T`返回操作数本身`, T`x or default 设默认值`],
        [T`可变默认参数`, T`列表跨调用共享`, T`def f(lst=None)`],
        [T`浅拷贝 / 深拷贝`, T`只拷外层 / 递归拷贝`, T`copy.deepcopy`],
        [T`+ 与 append`, T`产生新列表 / 就地修改`, T`循环内用 append`],
        [T`== None`, T`违背惯例的写法`, T`一律写 is None`],
      ],
    },
  },
];

// ================= 组装 =================
const children = [
  para(run(docTitle, { bold: true, size: 44, color: palette.dark }), {
    heading: HeadingLevel.TITLE, alignment: AlignmentType.CENTER, spacing: { before: 1200, after: 300 },
  }),
  para(run(T`—— 以思维导图分板块呈现 ——`, { size: 26, color: palette.light }),
    { alignment: AlignmentType.CENTER, spacing: { after: 1200 } }),
  bodyPara(T`本文档系统梳理 Python 语言中的基础符号与核心语法，按七大板块组织。每个板块先给出思维导图，从整体上呈现该板块的知识结构，再辅以要点说明与速查表格。文末附录给出运算符优先级与易混淆点辨析，可作为日常编码的速查手册。`),
  bodyPara(T`阅读建议：先浏览总览思维导图建立整体框架，再按章节逐个板块深入；表格中的示例均可直接在解释器中验证。`),
  pageBreak(),
  para(run(T`目录`, { bold: true, size: 32, color: palette.dark }), {
    heading: HeadingLevel.HEADING_1, spacing: { before: 200, after: 160 },
  }),
  toc(chapters.map((c) => ({ title: c.title, level: 1, page: c.page }))),
  pageBreak(),
];

for (const ch of chapters) {
  children.push(heading(ch.title, 1));
  children.push(bodyPara(ch.intro));
  if (ch.image) {
    children.push(img(ch.image.file, ch.image.w, ch.image.nw, ch.image.nh));
    children.push(caption(ch.caption));
  }
  if (ch.table) {
    children.push(para(run(T`要点速查表`, { bold: true, size: 24, color: palette.primary }),
      { heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 120 } }));
    children.push(makeTable(ch.table.headers, ch.table.rows));
    children.push(para(run(""), { spacing: { after: 200 } }));
  }
  children.push(pageBreak());
}
children.pop(); // 去掉最后一个多余分页

const doc = new Document({
  features: { updateFields: true },
  sections: [{
    properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
    headers: { default: new Header({ children: [
      para(run(docTitle, { bold: true, size: 18, color: palette.primary }), { alignment: AlignmentType.CENTER }),
    ] }) },
    footers: { default: new Footer({ children: [
      para(new TextRun({ children: [PageNumber.CURRENT] }), { alignment: AlignmentType.CENTER }),
    ] }) },
    children,
  }],
});

fs.writeFileSync(outputPath, await Packer.toBuffer(doc));
