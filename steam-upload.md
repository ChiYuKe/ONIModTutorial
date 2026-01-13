# 📤 Steam Workshop 上传指南

配置好 `mod_info.yaml` 后，你可以使用《缺氧》游戏内置的工具将 Mod 上传至创意工坊。

---

## 1. 上传工具

<div align="center">
  <img src="/images/steam-upload/Tool.png" alt="Mod上传工具" width="600" />
</div>
 此工具是缺氧游戏附赠的，在库中可搜索到

---

## 2. 上传已有 Mod

如果你需要发布的 Mod，请参考下方界面：

<div align="center">
  <img src="/images/steam-upload/Tool_1.png" alt="发布界面" width="600" />
</div>

按照以下步骤配置上传信息：

* <Badge type="danger" text="1" /> **选择项目**：点击此处选择你准备好的 Mod 文件夹。
* <Badge type="danger" text="2" /> **路径确认**：确保显示的是整个 Mod 文件夹的完整路径。
* <Badge type="danger" text="3" /> **预览图**：选择你 Mod 文件夹中的 `preview.png` 文件（建议尺寸 512x512）。
* <Badge type="danger" text="4" /> **Mod 名称**：输入你希望在创意工坊上显示的标题。




::: warning 注意事项
1. **文件夹结构**：上传前请务必确认 `mod_info.yaml` 位于文件夹根目录。
2. **预览图限制**：图片大小不得超过 1MB，否则 Steam 可能会上传失败。
3. **版本号同步**：记得更新 `mod_info.yaml` 中的 `version` 字段，方便玩家识别更新内容。
:::