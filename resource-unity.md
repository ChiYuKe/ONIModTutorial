# 缺氧Mod开发 - Unity资源使用指南

缺氧是使用Unity游戏引擎开发的。所以很多机制与资源都与Unity开发是通用的。

在我们开发缺氧mod的过程中，我们可以巧妙的使用Unity相关的功能来扩展或增强我们对mod的开发能力。

## 常用Unity资源

1. Asset Bundle 资源整合包（简称AB包）
2. UI界面 - 自定义UI界面，比如sidescreen等
3. 动画效果 - 粒子效果、材质制作

## 详细介绍

### 1. Asset Bundle包（简称AB包）

**简介：**
Asset Bundle是Unity中一种资源打包格式，可以将游戏中的各种资源（如纹理、模型、预制体等）打包成一个独立的文件。在Mod开发中使用AB包有以下优势：
- 减少Mod的文件体积，提高加载效率
- 方便管理和更新资源
- 支持热更新，无需重新编译Mod
- 可以包含复杂的Unity资源，如预制体、动画等

**最常打包使用的内容：**
1. 图片资源（Sprite）
2. 预制体（Prefab）
   - 预制体经常用来制作自定义的UI界面、自定义的UI效果比如粒子效果Effect等，用预制体打包到AB包中

**使用步骤：**
1. **安装Asset Bundle Browser工具**
   Unity菜单栏 --> Windows --> Package Manager --> + --> Add package from git url -->
   `https://github.com/Unity-Technologies/AssetBundles-Browser.git`

2. **打包资源**
   Unity菜单栏 --> Windows --> Asset Bundle Browser-> Tab: Configure 确认 --> Tab: Build -> Build

3. **Mod中引用**
   需要引用 `UnityEngine.AssetBundleModule.dll` 包

   ```csharp
   using UnityEngine;
   
   // 载入ab包
   AssetBundle assetBundle = AssetBundle.LoadFromFile(file_path);
   
   // 加载资源
   // sprite 图片资源
   assetBundle.LoadAsset<Sprite>(sprite_name);
   
   // 挂载时机：[HarmonyPath(typeof(Asset),"OnPrefabInit")]
   // 资源挂载点：Assets.Sprites
   
   // prefab 预制体
   GameObject prefab = assetBundle.LoadAsset<GameObject>("gameobject_name");
   gameObjectNameInstance = Util.KInstantiate(prefab);
   ```

### 2. UI界面

**简介：**
在缺氧Mod开发中，自定义UI界面是增强用户体验的重要部分。常见的UI界面包括：
- SideScreen：物品或建筑的侧边信息栏
- 自定义对话框
- 配置面板

**实现方式：**
1. 使用Unity创建UI预制体，打包到AB包中
2. 在Mod中加载并实例化这些预制体
3. 使用Harmony补丁修改游戏的UI系统，将自定义UI集成到游戏中

### 3. 动画效果

**简介：**
动画效果可以为Mod添加视觉吸引力，包括：
- 粒子效果：如特效、光晕、烟雾等
- 材质动画：如发光、变色等效果
- 模型动画：如机械运动、角色动作等

**实现方式：**
1. 在Unity中创建动画效果和材质
2. 打包到AB包中
3. 在Mod中加载并应用这些效果

## 最佳实践

1. **资源管理**：合理组织AB包，避免过大的包体
2. **性能优化**：只加载必要的资源，及时卸载不需要的资源
3. **版本控制**：为AB包添加版本号，方便更新和兼容性管理
4. **错误处理**：添加资源加载失败的处理逻辑

## 注意事项

- 确保使用与游戏版本兼容的Unity版本
- 避免使用Unity的新特性，确保向后兼容性
- 测试不同平台上的资源加载情况
- 遵守Klei的Mod开发规范

通过合理使用Unity资源，你可以创建更加丰富和专业的缺氧Mod，为玩家带来更好的游戏体验。