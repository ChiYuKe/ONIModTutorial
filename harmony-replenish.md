---
sidebar: false
---

<a href="./csharp-basics#back-point1" style="
  position: fixed;
  left: 20px;
  top: 100px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  background-color: var(--vp-c-brand);
  color: white;
  border-radius: 20px;
  text-decoration: none;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: transform 0.2s;
  z-index: 100;
">
⬅ 返回
</a>

# 🧩 Harmony 补丁整理（ONI Mod 实战）

> **本篇是 Harmony 在《缺氧（ONI）》Mod 开发中的实战速查表**  
> 👉 目标：**照抄即用、知道什么时候该用哪一种 Patch**

---

## 📖 阅读指引

- **新手**：只看 `Harmony 初始化 + Prefix / Postfix`
- **中级**：重点 `__instance / __state / AccessTools`
- **进阶**：`Transpiler / Finalizer`

---

## 🧠 一、Harmony 是什么？（ONI 为什么必须用它）

Harmony 是一个 **运行时方法注入库**，用于在**不修改源代码**的情况下：

- 插入逻辑
- 拦截原方法
- 修改返回值
- 重写部分执行流程

在 ONI 中：

- ❌ 不能改游戏源码
- ❌ 不能重新编译 Assembly
- ✅ **只能靠 Harmony**

> 📌 结论：**ONI Mod ≈ Harmony Patch 集合**

---

## 🧩 二、Patch 类型总览

| Patch 类型 | 执行时机 | 常见用途 |
|----------|----------|----------|
| Prefix | 原方法执行前 | 拦截 / 改参数 / 阻止执行 |
| Postfix | 原方法执行后 | 补充逻辑 / 改返回值 |
| Transpiler | IL 层 | 改硬编码 / if / 常量 |
| Finalizer | 所有逻辑后 | 捕获异常 / 兜底 |

> ⚠️ 所有 Patch 方法 **必须是 static**

---

## ⚙️ 三、Harmony 初始化（ONI 唯一正确姿势）

> ONI 已帮你处理 `PatchAll`，**不要自己再调**

```csharp
using HarmonyLib;

public class Patch : UserMod2
{
    public override void OnLoad(Harmony harmony)
    {
        base.OnLoad(harmony);
        // Harmony 已由 ONI 自动 PatchAll
    }
}
```

---

## 🟦 四、Prefix（最常用、侵入性最高）

### 4.1 最基础 Prefix

```csharp
[HarmonyPatch(typeof(Operational), nameof(Operational.SetActive))]
public static class Operational_SetActive_Patch
{
    public static void Prefix(bool active)
    {
    }
}
```

📌 **适合**：  
- 监控调用  
- 记录参数  

---

### 4.2 阻止原方法执行（return false）

```csharp
public static bool Prefix(bool active)
{
    return false;
}
```

📌 **适合**：  
- 强制建筑常开  
- 禁用原生逻辑  

---

### 4.3 使用 `__instance` 操作对象本体

```csharp
public static bool Prefix(Operational __instance, bool active)
{
    __instance.SetActive(true);
    return false;
}
```

📌 **这是 ONI Mod 里最常见的写法之一**

---

## 🟩 五、Postfix（最安全、最推荐）

### 5.1 基础 Postfix

```csharp
[HarmonyPatch(typeof(Generator), "OnSpawn")]
public static class Generator_OnSpawn_Patch
{
    public static void Postfix(Generator __instance)
    {
        __instance.operational.SetActive(true);
    }
}
```

📌 **适合**：  
- 初始化后补逻辑  
- 不破坏原流程  

---

### 5.2 修改返回值（必须 `ref __result`）

```csharp
[HarmonyPatch(typeof(Building), nameof(Building.IsOperational))]
public static class Building_IsOperational_Patch
{
    public static void Postfix(ref bool __result)
    {
        __result = true;
    }
}
```

---

## 🔁 六、Prefix / Postfix 间传值（`__state`）

```csharp
[HarmonyPatch(typeof(Storage), "Store")]
public static class Storage_Store_Patch
{
    public static void Prefix(ref int __state)
    {
        __state = Time.frameCount;
    }

    public static void Postfix(int __state)
    {
        Debug.Log("Store cost frame: " + (Time.frameCount - __state));
    }
}
```

📌 **用途**：  
- 性能统计  
- 前后状态对比  

---

## 🔓 七、访问 private 字段（AccessTools）

```csharp
using System.Reflection;

static readonly FieldInfo CAPACITY =
    AccessTools.Field(typeof(Storage), "capacityKg");

[HarmonyPatch(typeof(Storage), "OnSpawn")]
public static class Storage_OnSpawn_Patch
{
    public static void Postfix(Storage __instance)
    {
        CAPACITY.SetValue(__instance, 9999f);
    }
}
```

📌 **ONI 中极其常用**

---

## 🧬 八、Transpiler（慎用）

```csharp
[HarmonyPatch(typeof(SomeClass), "SomeMethod")]
public static class SomeMethod_Transpiler
{
    public static IEnumerable<CodeInstruction> Transpiler(
        IEnumerable<CodeInstruction> instructions)
    {
        foreach (var ins in instructions)
            yield return ins;
    }
}
```

⚠️ **建议**：  
- 能不用就不用  
- 改错一次可能直接坏档  

---

## 🧯 九、Finalizer（异常兜底）

```csharp
[HarmonyPatch(typeof(SomeClass), "SomeMethod")]
public static class SomeMethod_Finalizer
{
    public static void Finalizer(Exception __exception)
    {
        if (__exception != null)
        {
            Debug.LogError(__exception);
        }
    }
}
```

---

## ⚠️ 十、ONI Mod 常见翻车点

- Patch 方法忘记 `static`
- 参数签名与原方法不一致
- Prefix `return false` 但没处理返回值
- Transpiler 修改逻辑过多

---

## ✅ 总结一句话

> **ONI Mod 的核心不是写逻辑，而是“选对 Patch 类型”**

---

