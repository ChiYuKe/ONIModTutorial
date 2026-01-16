# 🎨 游戏代码反编译



## 一. 代码反编译

如果你想了解游戏的逻辑（如建筑如何运作、掉落概率等），你需要反编译游戏的 `.dll` 文件。

### 🛠️ 工具：dnSpy

目前社区最推荐的 `.NET` 反编译器和调试器。

* **[📥 官方仓库 (GitHub Releases)](https://github.com/dnSpyEx/dnSpy/releases)**
* **适用范围**：查看 `C#` 代码、搜索特定方法、甚至直接修改并重新编译代码。

#### 💡 操作步骤

* 找到游戏的程序集文件：通常位于 `OxygenNotIncluded_Data/Managed/Assembly-CSharp.dll` 。

* 将该文件拖入 **dnSpy** 。

* 使用 `Ctrl + Shift + K` 进行全局搜索，快速定位你想研究的类名（如 `ElectrolyzerConfig` ）。   

* 或者选择目标 `.dll` 文件，将其导出成 `Visual Studio` 工程文件。  
