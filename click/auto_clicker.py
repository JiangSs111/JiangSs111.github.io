# -*- coding: utf-8 -*-
"""
屏幕区域连点器 (Region Auto Clicker) — Windows
================================================

功能：
  * 频率可调（0.5 ~ 1000 次/秒，也可直接输入精确数值）
  * 鼠标拖拽框选屏幕区块位置
  * 区块大小 / 坐标可微调（数字输入），可实时显示区域边框
  * 点击模式：区域内随机点 / 区域中心
  * 鼠标左键 / 右键
  * 全局快捷键：F6 开始 / 停止（任何界面下都有效），Esc 停止框选
  * 仅使用 Python 标准库（tkinter + ctypes），无需安装任何依赖

运行：
  python auto_clicker.py
"""

import ctypes
import random
import threading
import time
import tkinter as tk
from tkinter import ttk

# ---------------------------------------------------------------- Win32 API
user32 = ctypes.windll.user32

VK_F6 = 0x75
VK_LBUTTON = 0x01
VK_RBUTTON = 0x02

MOUSEEVENTF_LEFTDOWN = 0x0002
MOUSEEVENTF_LEFTUP = 0x0004
MOUSEEVENTF_RIGHTDOWN = 0x0008
MOUSEEVENTF_RIGHTUP = 0x0010


def get_async_key_state(vk: int) -> int:
    return user32.GetAsyncKeyState(vk)


def do_click(x: int, y: int, button: str = "left") -> None:
    """移动鼠标到 (x, y) 并点击一次。"""
    user32.SetCursorPos(int(x), int(y))
    if button == "left":
        user32.mouse_event(MOUSEEVENTF_LEFTDOWN, 0, 0, 0, 0)
        user32.mouse_event(MOUSEEVENTF_LEFTUP, 0, 0, 0, 0)
    else:
        user32.mouse_event(MOUSEEVENTF_RIGHTDOWN, 0, 0, 0, 0)
        user32.mouse_event(MOUSEEVENTF_RIGHTUP, 0, 0, 0, 0)


# ------------------------------------------------------- 屏幕框选（拖拽选区）
class RegionSelector(tk.Toplevel):
    """全屏半透明遮罩，按住左键拖拽框选区域，松开确认，Esc 取消。"""

    def __init__(self, master, on_done):
        super().__init__(master)
        self.on_done = on_done
        self.overrideredirect(True)
        self.attributes("-topmost", True)
        self.attributes("-alpha", 0.30)
        self.configure(bg="gray20")
        w = self.winfo_screenwidth()
        h = self.winfo_screenheight()
        self.geometry(f"{w}x{h}+0+0")
        self.canvas = tk.Canvas(self, bg="gray20", highlightthickness=0,
                                cursor="crosshair")
        self.canvas.pack(fill="both", expand=True)
        self.canvas.create_text(
            w // 2, 40,
            text="按住左键拖拽框选点击区域，松开确认（Esc 取消）",
            fill="white", font=("Microsoft YaHei UI", 16, "bold"))
        self._sx = self._sy = 0
        self._rect = None
        self.canvas.bind("<ButtonPress-1>", self._press)
        self.canvas.bind("<B1-Motion>", self._drag)
        self.canvas.bind("<ButtonRelease-1>", self._release)
        self.bind("<Escape>", lambda e: self.destroy())
        self.focus_force()

    def _press(self, e):
        self._sx, self._sy = e.x_root, e.y_root
        if self._rect:
            self.canvas.delete(self._rect)
        self._rect = self.canvas.create_rectangle(
            e.x, e.y, e.x, e.y, outline="#00e5ff", width=3)

    def _drag(self, e):
        self.canvas.coords(self._rect, self._sx, self._sy, e.x_root, e.y_root)

    def _release(self, e):
        x1, x2 = sorted((self._sx, e.x_root))
        y1, y2 = sorted((self._sy, e.y_root))
        w, h = x2 - x1, y2 - y1
        self.destroy()
        if w >= 4 and h >= 4:          # 太小的框视为误触
            self.on_done(x1, y1, w, h)


# --------------------------------------------------------- 区域边框预览窗口
class RegionBorder(tk.Toplevel):
    """在屏幕上显示区域边框（内部透明、不拦截鼠标）。"""

    MAGIC = "#ff00ff"  # 透明色键

    def __init__(self, master):
        super().__init__(master)
        self.overrideredirect(True)
        self.attributes("-topmost", True)
        self.attributes("-transparentcolor", self.MAGIC)
        self.canvas = tk.Canvas(self, bg=self.MAGIC, highlightthickness=0)
        self.canvas.pack(fill="both", expand=True)
        self.withdraw()

    def show_at(self, x, y, w, h):
        self.geometry(f"{w}x{h}+{x}+{y}")
        self.canvas.delete("all")
        self.canvas.create_rectangle(1, 1, w - 2, h - 2,
                                     outline="#00e5ff", width=3)
        self.deiconify()

    def hide(self):
        self.withdraw()


# ------------------------------------------------------------- 悬浮运行窗
class MiniController(tk.Toplevel):
    """悬浮运行窗：启动/暂停按钮 + 频率 −/＋ 调节，始终置顶。"""

    def __init__(self, app):
        super().__init__(app)
        self.app = app
        self.title("连点器")
        self.resizable(False, False)
        self.attributes("-topmost", True)
        self.geometry("+60+60")
        self.protocol("WM_DELETE_WINDOW", self._hide)   # 关闭按钮 = 隐藏

        row = ttk.Frame(self, padding=6)
        row.pack()
        self.btn_toggle = ttk.Button(row, text="▶ 启动", width=7,
                                     command=app.toggle)
        self.btn_toggle.pack(side="left", padx=(0, 6))
        ttk.Button(row, text="−", width=3,
                   command=lambda: self._bump(-1)).pack(side="left")
        self.lbl_freq = ttk.Label(row, text="5.0/s", width=7, anchor="center",
                                  font=("Microsoft YaHei UI", 10, "bold"))
        self.lbl_freq.pack(side="left", padx=2)
        ttk.Button(row, text="＋", width=3,
                   command=lambda: self._bump(1)).pack(side="left")

    def _bump(self, sign):
        f = float(self.app.var_freq.get())
        # 自适应步进：低频微调，高频大步
        if f < 5:
            step = 0.5
        elif f < 20:
            step = 1.0
        elif f < 100:
            step = 5.0
        else:
            step = 50.0
        f = min(1000.0, max(0.5, round(f + sign * step, 1)))
        self.app.var_freq.set(f)
        self.app._freq_changed()

    def refresh(self):
        self.btn_toggle.config(
            text="⏸ 暂停" if self.app.running else "▶ 启动")
        self.lbl_freq.config(text=f"{float(self.app.var_freq.get()):.1f}/s")

    def _hide(self):
        self.app.var_show_mini.set(False)
        self.withdraw()


# ----------------------------------------------------------------- 主程序
class AutoClickerApp(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("屏幕区域连点器  ·  F6 开始/停止")
        self.resizable(False, False)
        self.attributes("-topmost", True)

        # 运行状态
        self.running = False
        self.click_count = 0
        self._stop_event = threading.Event()
        self._click_thread = None
        self._f6_was_down = False

        # 可调参数
        self.var_freq = tk.DoubleVar(value=5.0)        # 次/秒
        self.var_x = tk.IntVar(value=400)
        self.var_y = tk.IntVar(value=300)
        self.var_w = tk.IntVar(value=200)
        self.var_h = tk.IntVar(value=120)
        self.var_mode = tk.StringVar(value="random")   # random / center
        self.var_button = tk.StringVar(value="left")   # left / right
        self.var_show_border = tk.BooleanVar(value=True)
        self.var_show_mini = tk.BooleanVar(value=True)

        self._build_ui()

        self.border = RegionBorder(self)
        self.mini = MiniController(self)
        self.mini.refresh()
        self._sync_cfg()
        self._refresh_border()
        self.protocol("WM_DELETE_WINDOW", self._on_close)

        # F6 全局热键轮询线程
        threading.Thread(target=self._hotkey_loop, daemon=True).start()
        # UI 状态刷新
        self.after(100, self._status_tick)

    # ------------------------------------------------------------ UI 布局
    def _build_ui(self):
        pad = {"padx": 8, "pady": 4}
        main = ttk.Frame(self)
        main.pack(**pad)

        # --- 频率 ---
        freq = ttk.LabelFrame(main, text=" 点击频率 ")
        freq.pack(fill="x", **pad)
        self.lbl_freq = ttk.Label(freq, text="5.0 次/秒（间隔 200 毫秒）",
                                  font=("Microsoft YaHei UI", 10, "bold"))
        self.lbl_freq.pack(anchor="w", padx=8, pady=(4, 0))
        scale = ttk.Scale(freq, from_=0.5, to=1000.0, variable=self.var_freq,
                          command=lambda _v: self._freq_changed())
        scale.pack(fill="x", padx=8, pady=4)
        row = ttk.Frame(freq)
        row.pack(fill="x", padx=8, pady=(0, 6))
        ttk.Label(row, text="精确输入：").pack(side="left")
        ent = ttk.Entry(row, width=8)
        ent.insert(0, "5.0")
        ent.pack(side="left")
        ttk.Label(row, text=" 次/秒").pack(side="left")
        ttk.Button(row, text="应用",
                   command=lambda: self._apply_freq_entry(ent)).pack(
                       side="left", padx=6)

        # --- 区域 ---
        area = ttk.LabelFrame(main, text=" 点击区块 ")
        area.pack(fill="x", **pad)
        grid = ttk.Frame(area)
        grid.pack(padx=8, pady=4)
        for col, (label, var, lo, hi) in enumerate([
                ("左上角 X", self.var_x, 0, 9999),
                ("左上角 Y", self.var_y, 0, 9999),
                ("宽度", self.var_w, 4, 9999),
                ("高度", self.var_h, 4, 9999)]):
            ttk.Label(grid, text=label).grid(row=0, column=col, padx=4)
            sb = ttk.Spinbox(grid, from_=lo, to=hi, width=7,
                             textvariable=var,
                             command=self._refresh_border)
            sb.grid(row=1, column=col, padx=4, pady=2)
            sb.bind("<KeyRelease>", lambda _e: self._refresh_border())
        btns = ttk.Frame(area)
        btns.pack(fill="x", padx=8, pady=(2, 6))
        ttk.Button(btns, text="🖱 框选屏幕区域",
                   command=self._start_select).pack(side="left")
        ttk.Checkbutton(btns, text="显示区域边框",
                        variable=self.var_show_border,
                        command=self._refresh_border).pack(side="left", padx=10)

        # --- 点击方式 ---
        opt = ttk.LabelFrame(main, text=" 点击方式 ")
        opt.pack(fill="x", **pad)
        orow = ttk.Frame(opt)
        orow.pack(anchor="w", padx=8, pady=4)
        ttk.Radiobutton(orow, text="区域内随机位置", value="random",
                        variable=self.var_mode).pack(side="left")
        ttk.Radiobutton(orow, text="区域中心", value="center",
                        variable=self.var_mode).pack(side="left", padx=10)
        ttk.Separator(orow, orient="vertical").pack(side="left", fill="y",
                                                    padx=10)
        ttk.Radiobutton(orow, text="左键", value="left",
                        variable=self.var_button).pack(side="left")
        ttk.Radiobutton(orow, text="右键", value="right",
                        variable=self.var_button).pack(side="left", padx=8)

        # --- 控制 ---
        ctl = ttk.Frame(main)
        ctl.pack(fill="x", **pad)
        self.btn_toggle = ttk.Button(ctl, text="▶ 开始 (F6)",
                                     command=self.toggle)
        self.btn_toggle.pack(side="left", expand=True, fill="x", padx=(0, 4))
        ttk.Button(ctl, text="重置计数",
                   command=self._reset_count).pack(side="left")
        ttk.Checkbutton(ctl, text="悬浮运行窗",
                        variable=self.var_show_mini,
                        command=self._toggle_mini).pack(side="left", padx=8)

        self.lbl_status = ttk.Label(main, text="状态：待命  ·  已点击 0 次",
                                    anchor="center")
        self.lbl_status.pack(fill="x", padx=8, pady=(0, 8))

    # ------------------------------------------------------------ 参数变化
    def _freq_changed(self):
        f = max(0.1, float(self.var_freq.get()))
        ms = 1000.0 / f
        ms_text = f"{ms:.2f}" if ms < 10 else f"{ms:.0f}"
        self.lbl_freq.config(
            text=f"{f:.1f} 次/秒（间隔 {ms_text} 毫秒）")
        if hasattr(self, "mini"):
            self.mini.refresh()

    def _apply_freq_entry(self, entry):
        try:
            f = min(1000.0, max(0.5, float(entry.get())))
            self.var_freq.set(f)
            self._freq_changed()
        except ValueError:
            pass

    def _toggle_mini(self):
        if self.var_show_mini.get():
            self.mini.deiconify()
            self.mini.refresh()
        else:
            self.mini.withdraw()

    def _start_select(self):
        self.border.hide()
        self.iconify()

        def done(x, y, w, h):
            self.var_x.set(x)
            self.var_y.set(y)
            self.var_w.set(w)
            self.var_h.set(h)
            self.deiconify()
            self._refresh_border()

        sel = RegionSelector(self, done)
        # 若用户 Esc 取消，也要恢复主窗口
        sel.bind("<Destroy>",
                 lambda _e: self.after(50, self._restore_after_select))

    def _restore_after_select(self):
        if self.state() == "iconic":
            self.deiconify()
            self._refresh_border()

    def _refresh_border(self):
        if not self.var_show_border.get() or self.running:
            self.border.hide()
            return
        try:
            self.border.show_at(self.var_x.get(), self.var_y.get(),
                                self.var_w.get(), self.var_h.get())
        except tk.TclError:
            pass

    # ------------------------------------------------------------ 启停逻辑
    def toggle(self):
        if self.running:
            self.stop()
        else:
            self.start()

    def start(self):
        self.running = True
        self._stop_event.clear()
        self._sync_cfg()
        self.border.hide()
        self.btn_toggle.config(text="⏸ 停止 (F6)")
        self.mini.refresh()
        self._click_thread = threading.Thread(target=self._click_loop,
                                              daemon=True)
        self._click_thread.start()

    def stop(self):
        self.running = False
        self._stop_event.set()
        self.btn_toggle.config(text="▶ 开始 (F6)")
        self.mini.refresh()
        self._refresh_border()

    def _reset_count(self):
        self.click_count = 0

    def _sync_cfg(self):
        """把 tk 变量快照为纯 Python 元组，供点击线程安全读取。"""
        try:
            self._cfg = (max(0.1, float(self.var_freq.get())),
                         self.var_x.get(), self.var_y.get(),
                         self.var_w.get(), self.var_h.get(),
                         self.var_mode.get(), self.var_button.get())
        except tk.TclError:
            pass

    def _click_loop(self):
        # 只读 self._cfg 快照，不在子线程里碰 tk 变量（非线程安全）
        # timeBeginPeriod(1) 把系统计时器精度提到 1ms，高频连点才能达到标称速率
        winmm = ctypes.windll.winmm
        winmm.timeBeginPeriod(1)
        try:
            while not self._stop_event.is_set():
                f, x, y, w, h, mode, btn = self._cfg
                if mode == "center":
                    cx, cy = x + w // 2, y + h // 2
                else:
                    cx = random.randint(x, x + w - 1)
                    cy = random.randint(y, y + h - 1)
                t0 = time.perf_counter()
                do_click(cx, cy, btn)
                self.click_count += 1
                interval = 1.0 / f
                remain = interval - (time.perf_counter() - t0)
                if remain > 0.004:          # 先粗睡到剩 ~3ms（可被打断）
                    self._stop_event.wait(remain - 0.003)
                while (not self._stop_event.is_set()
                       and time.perf_counter() - t0 < interval):
                    pass                    # 尾部忙等，保证 1ms 级精度
        finally:
            winmm.timeEndPeriod(1)

    # ------------------------------------------------------------ 热键轮询
    def _hotkey_loop(self):
        while True:
            down = bool(get_async_key_state(VK_F6) & 0x8000)
            if down and not self._f6_was_down:      # 按下沿触发
                self.after(0, self.toggle)
            self._f6_was_down = down
            time.sleep(0.05)

    # ------------------------------------------------------------ 状态刷新
    def _status_tick(self):
        self._sync_cfg()   # 主线程内持续同步参数快照给点击线程
        state = "运行中 ⚡" if self.running else "待命"
        self.lbl_status.config(
            text=f"状态：{state}  ·  已点击 {self.click_count} 次")
        self.after(100, self._status_tick)

    def _on_close(self):
        self.stop()
        self.border.destroy()
        self.mini.destroy()
        self.destroy()


if __name__ == "__main__":
    app = AutoClickerApp()
    app.mainloop()
