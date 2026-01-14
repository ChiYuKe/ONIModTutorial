# 📂 Mod 目录结构

一个标准的《缺氧》Mod 目录通常包含以下核心文件。理解这些文件的角色是开发的第一步。

## 1. 典型结构总览

每个模组都使用一个单独文件夹，例如，你的`MyFirstMod`路径应该如下所示： 
`...\Klei\OxygenNotIncluded\mods\Dev\MyFirstMod\`
* `MyFirstMod.dll`
* `mod.yaml`
* `mod_info.yaml`
```text
MyFirstMod/
├── mod_info.yaml           #  Mod 的元数据与版本兼容性配置
├── mod.yaml                #  用于配置 Mod 的名称、描述等静态信息
├── MyFirstMod.dll               #  编译后的程序集文件（逻辑代码）
└── preview.png             #  Steam 创意工坊显示的预览图

```
## 2. 配置文件详解
::: code-group
```yaml [mod_info.yaml 模板]
supportedContent: ALL       # 支持范围：VANILLA_ID, EXPANSION1_ID, 或 ALL
minimumSupportedBuild: 512719 # 运行该 Mod 所需的最低游戏版本号
version: "1.0.0"            # 你自己的 Mod 版本号
```
:::


::: code-group
```yaml [mod.yaml 模板]
title: "MyFirstMod"  # 游戏内 Mod 列表显示的名称
description: "这是一个示例描述"  # 游戏内显示的详细功能介绍
staticID: "AuthorName.MyMod"  # Mod 的唯一标识符（建议格式：作者名.Mod名）
```
:::






## 3. 资源与可选目录 (进阶)
当你的 Mod 不再仅仅是简单的逻辑修改，而是涉及新建筑、新美术或多语言支持时，需要建立以下目录结构：
* **/translations/：** 用于存放多语言翻译文件（.pot 或 .po）。
* **/anim/assets/：** 存放自定义建筑、生物或掉落物的动画资源。
* **/assets/：** 额外素材
* **/elements/：** 存放自定义元素的配置数据。
* **/worldgen/：** 涉及地形生成、生物群落（Biomes）修改时的核心目录。包含 `biomes`、`features` 等子文件夹。
