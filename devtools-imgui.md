# 开启 ImGui DevTools

《缺氧》本体里内置了一套基于 ImGui 的开发者工具。  
它不是 Mod 必需品，但在排查游戏对象、查看运行状态、定位 Patch 入口时非常好用。

这一章讲怎么开启它，以及源码里对应的判断条件。

---

## 一、它是什么

ImGui DevTools 是游戏内部的调试菜单。开启后，游戏顶部会出现一条开发者菜单栏，可以打开一些调试面板，例如：

- Sim Debug
- State Machine
- Save Game Info
- Performance Info
- Scene Browser
- Scene Inspector
- UI Debugger

对 Mod 开发来说，最常用的是查看对象、场景、状态机和 UI 结构。

---

## 二、开启条件

源码里的核心判断在 `DebugHandler` 构造函数中：

```csharp
DebugHandler.enabled = File.Exists(Path.Combine(Application.dataPath, "debug_enable.txt"));
DebugHandler.enabled = DebugHandler.enabled || File.Exists(Path.Combine(Application.dataPath, "../debug_enable.txt"));
DebugHandler.enabled = DebugHandler.enabled || GenericGameSettings.instance.debugEnable;
```

也就是说，只要满足下面任意一种方式，就会启用 Debug 功能。

### 方式 1：在游戏根目录创建 debug_enable.txt

进入《缺氧》的安装目录，在和 `OxygenNotIncluded.exe` 同级的位置新建一个空文件：

```text
debug_enable.txt
```

例如 Steam 版常见路径类似：

```text
D:\Program Files (x86)\Steam\steamapps\common\OxygenNotIncluded\debug_enable.txt
```

这是最推荐的方式，简单、直观，也方便随时删除。

### 方式 2：放到 Data 目录

也可以把文件放到：

```text
OxygenNotIncluded_Data\debug_enable.txt
```

源码会同时检查游戏根目录和 `OxygenNotIncluded_Data` 目录。

### 方式 3：修改 settings.yml

游戏根目录下的 `settings.yml` 也可以开启。  
这个字段通常需要自己手动加入；如果文件里没有 `debugEnable`，就在顶层新增一行：

```yaml
debugEnable: true
```

如果游戏根目录下还没有 `settings.yml`，可以自己创建一个。最小内容就是：

```yaml
debugEnable: true
```

这个方式适合你本来就在维护一份开发用配置文件的情况。  
如果只是临时开启调试，建议优先用 `debug_enable.txt`。

---

## 三、打开 ImGui 菜单

启用 Debug 后，启动游戏，在游戏内按：

```text
Ctrl + `
```

这里的 `` ` `` 是键盘左上角、数字 `1` 左边的反引号键。

第一次打开时，游戏会弹出 DevTools 警告窗口。确认后才会显示完整菜单。  
如果勾选不再提示，游戏会写入一个名为 `ShowDevtools` 的玩家偏好设置。

---

## 四、源码调用链

### 1. Debug 是否启用

入口是：

```csharp
public DebugHandler()
{
    DebugHandler.enabled = File.Exists(Path.Combine(Application.dataPath, "debug_enable.txt"));
    DebugHandler.enabled = DebugHandler.enabled || File.Exists(Path.Combine(Application.dataPath, "../debug_enable.txt"));
    DebugHandler.enabled = DebugHandler.enabled || GenericGameSettings.instance.debugEnable;
}
```

只有 `DebugHandler.enabled` 为 `true`，后面的 DevTools 才可能显示。

### 2. 快捷键切换显示

`DevToolManager.UpdateShouldShowTools()` 里处理显示开关：

```csharp
if (!DebugHandler.enabled)
{
    this.showImGui = false;
    return;
}

bool flag = Input.GetKeyDown(KeyCode.BackQuote)
    && (Input.GetKey(KeyCode.LeftControl) || Input.GetKeyDown(KeyCode.RightControl));

if (!this.toggleKeyWasDown && flag)
{
    this.showImGui = !this.showImGui;
}
```

所以真正控制 ImGui 显示的是 `showImGui`。

### 3. 每帧渲染

`Global.Update()` 中会获取 `ImGuiRenderer`，并根据 `DevTools.Show` 决定是否显示：

```csharp
ImGuiRenderer instance = ImGuiRenderer.GetInstance();
if (instance)
{
    this.DevTools.UpdateShouldShowTools();
    instance.gameObject.transform.parent.gameObject.SetActive(this.DevTools.Show);
    if (this.DevTools.Show)
    {
        instance.NewFrame();
    }
    this.DevTools.UpdateTools();
}
```

这也是为什么只创建 `debug_enable.txt` 还不够，还需要按快捷键把菜单打开。

---

## 五、常见问题

### 按 Ctrl + ` 没反应

优先检查：

1. `debug_enable.txt` 文件名是否正确
2. 文件是否真的在游戏根目录或 `OxygenNotIncluded_Data` 目录
3. 游戏是否已经重启
4. 键盘布局下的反引号键是否能被游戏识别

Debug 开关是在 `DebugHandler` 构造时读取的，所以创建文件后通常需要重启游戏。

### 只看到警告窗口，没有完整菜单

这是正常的。第一次打开时要确认 DevTools 警告。  
确认后才会进入完整的开发者菜单。

### 开启后会影响存档吗

使用调试功能可能会让游戏记录 `debugWasUsed`。  
如果只是打开菜单查看信息，一般不会直接破坏存档；但很多 DevTools 面板能修改游戏状态，操作前最好备份存档。

### 发布 Mod 时要不要带 debug_enable.txt

不要。  
`debug_enable.txt` 是本地开发环境开关，不属于 Mod 内容，也不应该随 Mod 发布。

---

## 六、推荐用法

开发 Mod 时，可以把 `debug_enable.txt` 常驻在本地游戏目录。  
平时用它做三件事：

1. 查看游戏对象和组件
2. 验证某个状态机、建筑或 UI 是否按预期运行
3. 配合 dnSpy 反查源码入口

如果你正在学习如何找 Patch 点，可以先看：

- [游戏源码分析工具](./dnspy-analysis.md)
- [Harmony 补丁整理](./harmony-reference.md)

ImGui DevTools 很适合和这两部分一起用：一个负责在运行时观察，一个负责在源码里定位。
