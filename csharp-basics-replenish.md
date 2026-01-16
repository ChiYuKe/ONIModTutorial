---
sidebar: false
---
<a href="javascript:history.back()" class="back-button">
  ⬅ 返回
</a>

<style scoped>
.back-button {
  position: fixed;
  left: 20px;
  top: 100px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  background-color: var(--vp-c-brand); 
  color: white !important;
  border-radius: 20px;
  text-decoration: none !important;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: transform 0.2s;
  z-index: 100;
  cursor: pointer;
}

.back-button:hover {
  transform: scale(1.05);
  opacity: 0.9;
}
</style>


# ⚡ C# 核心语法
---
这不是一篇“C# 入门”，而是 **专门为《缺氧（ONI）》Mod 开发提炼的最小语法集**。

> 🎯 阅读目标：
>
> * 能**直接看懂 ONI 源码**
> * 能**独立写 Harmony Patch**
> * 知道哪些语法是“必须会”，哪些可以先无视

---

## 🧠 总览

> **ONI Mod 的 C# 本质只有四件事：**
>
> 1️⃣ 类 + 组件
> 2️⃣ static + ref
> 3️⃣ 数组 + 泛型
> 4️⃣ null 判断

下面所有内容，都是在为这四点服务。

---

## 🧱 一、class 是一切的起点

### 你在 ONI 里只会写这三种类

```csharp
public class XXXConfig : IBuildingConfig {}
public class XXXPatch {}
public class XXXComponent : KMonoBehaviour {}
```

结论：

* **类必须是 `public`**
* 不要纠结面向对象

---

## 🔧 二、static：为什么 Patch 必须是 static

### 普通方法（ONI 几乎不用）

```csharp
public void DoSomething() {}
```

### Patch 方法（必须这样）

```csharp
public static void Postfix() {}
```

原因一句话解释：

> Harmony **不会 new 你的类**，只能调用静态方法。

👉 **Patch 写错 90% 都是这里的问题**

---

## 🧬 三、ref：为什么 ONI Patch 能“改游戏”

### 没有 ref（改不到）

```csharp
public static void Postfix(BuildingDef def)
{
    def.EnergyConsumptionWhenActive = 1f; // ❌ 无效
}
```

### 有 ref（直接改内存）

```csharp
public static void Postfix(ref BuildingDef __result)
{
    __result.EnergyConsumptionWhenActive = 1f; // ✅ 生效
}
```

一句话结论：

> **Harmony 能改游戏，全靠 ref。**

---

## 📦 四、组件思维：ONI ≈ Unity

### 所有功能 = 组件

```csharp
go.AddOrGet<ElementConverter>();
go.AddOrGet<Operational>();
```

### AddOrGet 的真实含义

```text
有 → 拿
无 → 加
```

> ❗ ONI 世界里
>
> * **没有组件 = 没有功能**

---

## 🔍 五、泛型 `<T>`：不要怕，它只是“占位”

### 看到下面这两行，直接翻译成中文

```csharp
go.AddOrGet<ElementConverter>();
go.GetComponent<KPrefabID>();
```

翻译：

> “我要 **ElementConverter** 这个组件”

> `<T>` = 类型占位符，仅此而已

---

## 🚧 六、null 判断：ONI Mod 的生命线

### 正确写法

```csharp
var converter = go.GetComponent<ElementConverter>();
if (converter == null)
    return;
```

原因一句话：

> Patch 执行顺序不固定，**组件不一定存在**。

👉 **不写 null 判断 = 随机崩溃**

---


