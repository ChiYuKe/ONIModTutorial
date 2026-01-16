# 🚀 编写第一个 Mod：节能电解器

本章将带你亲手编写一个 Mod，把电解器的 120W 功耗改为 1W。

---

## 一 . 准备工作

在开始之前，你需要手动创建一个文件夹，用于存放你开发的 Mod 文件：
* **路径**：`%USERPROFILE%\Documents\Klei\OxygenNotIncluded\mods\`
* **操作**：在此目录下创建一个名为 **`Dev`** 的文件夹。

---

## 二 . 创建项目

1.  打开 **Visual Studio 2022**。
2.  选择 **创建新项目** -> 搜索 **类库 (.NET Framework)** -> 点击下一步。
3.  **项目名称**：输入 `MyFirstMod`。
4.  **框架**：务必选择 **.NET Framework 4.7.1**。

---

## 三 . 导入游戏核心库 (References)

你需要把游戏的 `.dll` 文件“介绍”给 Visual Studio，它才能理解游戏代码。

1.  在右侧 **解决方案资源管理器** 中，当然你的可能在左侧，右键点击 **引用 (References)** -> **添加引用**。
2.  点击 **浏览**，进入游戏目录：  
    `...\steamapps\common\OxygenNotIncluded\OxygenNotIncluded_Data\Managed\`
3.  **选中并添加以下文件：**
    * `Assembly-CSharp.dll` 
    * `Assembly-CSharp-firstpass.dll` 
    * `0Harmony.dll` 
    * `UnityEngine.dll`
    * `UnityEngine.CoreModule.dll`

---

## 四 . 编写补丁代码

<!-- <a href="./harmony-replenish#postfix" class="guide-link">
  🚀 了解 Postfix 
</a>

<style scoped>
.guide-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 10px 0;
  padding: 8px 16px;
  background-color: var(--vp-c-brand-soft); /* 浅色背景 */
  color: var(--vp-c-brand-1) !important;    /* 品牌主色文本 */
  border: 1px solid var(--vp-c-brand);
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none !important;
  transition: all 0.2s ease;
}

.guide-link:hover {
  background-color: var(--vp-c-brand);      /* 悬浮变深色 */
  color: white !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style> -->
::: info 进阶指引
想要进一步了解补丁？请点击阅读：
[了解 Postfix →](./harmony-replenish.md#postfix)
:::
删除项目自动生成的 `Class1.cs` 里的所有内容，粘贴下面的代码：

```csharp
using HarmonyLib;

namespace MyFirstMod
{
    // 告诉游戏：要在 ElectrolyzerConfig 的 CreateBuildingDef 执行完后动刀
    [HarmonyPatch(typeof(ElectrolyzerConfig), "CreateBuildingDef")]
    public class MyFirstPatch
    {
        // Postfix 代表后置补丁
        public static void Postfix(ref BuildingDef __result)
        {
            // 将电解器的功耗改为 1 瓦
            __result.EnergyConsumptionWhenActive = 1f;
             Debug.Log("电解器的功耗已被修改为 1 瓦");
        }
    }
}
```

### 📝 调试技巧
> 如果 Mod 运行不正常，可以在这里查看日志排查：

`%USERPROFILE%\AppData\LocalLow\Klei\Oxygen Not Included\player.log`

---
## 🎁 五 . 下载项目模板 (可选)

前面叽里咕噜没看懂？
没关系，我这里提供了一份Mod模板，如果你是按教程来的，那么在这里我将默认你安装了Visual Studio 2026版本。

### 安装方法：

*  [点击此处下载模板 .zip 文件](/templates/ONIModTemplate.zip)（不要解压）。
*  将其放入Visual Studio 模板文件夹：
>  `%USERPROFILE%\Documents\Visual Studio 18\Templates\ProjectTemplates`
<details>
  <summary>📸 点击展开查看ProjectTemplates目录结构</summary>
  <br>
  <div align="center">
    <img src="/images/first-mod/Project.png" alt="发布界面" width="600" />
  </div>
</details>

*  重启你的Visual Studio, 创建项目时候你将可以看到：

<details>
  <summary>📸 点击展开查看预览图</summary>
  <br>
  <div align="center">
    <img src="/images/first-mod/ModTemplate.png" alt="发布界面" width="600" />
  </div>
</details>


## 六 . 编译与部署

1. **生成 DLL**：点击顶部菜单栏的 **生成 (Build)** -> **生成解决方案**， 或者直接在 **解决方案资源管理器** 当中右键项目然后 **生成 (Build)**。
2. **找到文件**：进入项目文件夹的 `bin/Debug` 目录，找到 `MyFirstMod.dll`。
3. **放入游戏**：在 `Documents\Klei\OxygenNotIncluded\mods\Dev\` 当中创建一个`MyFirstMod`文件夹，将 `MyFirstMod.dll`放入其中，记住不要少了上一章讲的
`mod.yaml` 和 `mod_info.yaml`

---