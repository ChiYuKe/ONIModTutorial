# 🔄 多版本兼容性与发布管理

为了确保 Mod 能够在不同版本的《缺氧》（如本体、DLC、测试版）中正常运行，你需要正确配置 `mod_info.yaml` 和 `archived_versions` 文件夹。

---

## 1. 核心配置文件：mod_info.yaml



每个发布到 Steam Workshop 的 Mod 根目录必须包含 `mod_info.yaml`。它决定了 Mod 的“准入资格”。

::: code-group
```yaml [mod_info.yaml 模板]
supportedContent: ALL       # 支持范围：VANILLA_ID, EXPANSION1_ID, 或 ALL
minimumSupportedBuild: 512719 # 运行该 Mod 所需的最低游戏版本号
version: "1.0.0"            # 你自己的 Mod 版本号
```
:::

## 2. 文件夹结构：archived_versions

当你需要同时兼容当前稳定版和之前的旧版本时，不能只靠一个 .dll。你需要使用文件夹分层。

📂 推荐目录结构
::: details 点击查看结构树
```yaml
MyMod/
├── mod_info.yaml           # 最新版的信息（通常指向当前正式版）
├── mod.yaml                # 最新版的基本描述（通常指向当前正式版）
├── MyMod.dll               # 适用于当前最新正式版的代码
└── archived_versions/      # 存档版本文件夹
    └── 512719/             # 文件夹名 = 适用的最低游戏版本号
        ├── mod_info.yaml   # 该版本的独立信息
        ├── mod.yaml        # 该版本的基本描述
        └── MyMod.dll       # 该版本的专用代码
```
:::

⚙️ 运行逻辑说明
扫描阶段：游戏启动时会优先扫描 archived_versions 文件夹。

匹配阶段：它会寻找文件夹名（版本号）小于或等于当前游戏版本，且最接近当前版本的文件夹。

回退阶段：如果没有匹配的归档文件夹，则运行根目录下的默认文件。

## 3. 兼容性开发建议

::: tip 🛡️ 为什么使用这种结构？

* **版本隔离（防止“炸档”）：** 当游戏大版本更新导致 API 变更时，旧版本用户会自动定向到 `archived_versions` 运行，确保插件不会因环境冲突而崩溃。
* **双轨并行（分支维护）：** 支持同时为 **测试版 (Testing Branch)** 和 **正式版 (Live Branch)** 维护两套完全独立的 DLL 逻辑，互不干扰。
:::

### 🛠️ 自动化生成事件

在 Visual Studio 的项目属性中添加 **生成事件 (Post-build event)**，可实现编译后自动归档到对应文件夹：

```batch
# 如果是 Release 配置，自动拷贝到 512719 归档目录
if "$(ConfigurationName)" == "Release" (
    xcopy /Y "$(TargetDir)$(TargetFileName)" "$(ProjectDir)archived_versions\512719\"
)
```