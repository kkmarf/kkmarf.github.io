# 📝 kkLullaby 的个人博客使用手册

欢迎使用你的全新个人博客！这个博客基于 **Hugo** 静态网站生成器构建，使用 **PaperMod** 主题，具有极速、简约、SEO 友好的特点。

本文档将指导你如何进行日常的写作、管理和发布。

---

## 🚀 1. 快速开始

### 启动本地预览
在开始写作前，建议启动本地服务器，这样可以实时预览修改效果。

打开终端，在博客根目录执行：
```bash
hugo server -D
```
* `-D` 参数表示包含草稿 (draft: true) 的文章。
* 启动后，浏览器访问 `http://localhost:1313` 即可预览。

---

## ✍️ 2. 如何写博文

### 创建新文章
你可以手动创建文件，也可以使用命令。

**方法一：使用 Hugo 命令（推荐）**
```bash
hugo new posts/你的文章文件名.md
# 例如：
hugo new posts/my-first-post.md
```
这会在 `content/posts/` 目录下生成文件，并自动填充头部信息（Front Matter）。

**方法二：手动创建**
直接在 `content/posts/` 文件夹下新建 `.md` 文件，复制以下模板：

### 文章头部信息 (Front Matter) 详解
每篇文章的开头都有 metadata，用于控制文章的属性：

```yaml
---
title: "文章标题"
date: 2026-01-19T12:00:00+08:00
draft: true              # true 为草稿（发布时不显示），false 为正式发布
author: "kkLullaby"
categories: ["技术", "生活"]   # 文章分类
tags: ["教程", "Hugo"]       # 文章标签

# 选填项
description: "这是一段用于 SEO 的描述"
summary: "这是一段显示在首页的文章摘要，如果不写默认截取正文前几行"
weight: 1                # 置顶权重，数字越小越靠前
cover:
  image: "img/cover.jpg" # 封面图路径（相对于 static 目录或文章同级目录）
  alt: "封面描述"
  caption: "图片标题"
  relative: false        # 是否使用相对路径
---
```

### 正文写作
正文使用标准的 Markdown 语法。

* **代码块**：
  \`\`\`python
  print("Hello World")
  \`\`\`

* **插入图片**：
  将图片放在 `static/images/` 目录下，引用方式：
  `![图片描述](/images/你的图片.jpg)`

---

## 📂 3. 管理专栏与页面

博客目前包含以下主要页面，对应的文件位置：

* **📜 首页**：由 `hugo.toml` 配置和文章自动生成
* **✍️ 文章列表**：`content/posts/` 目录下的所有文件
* **👤 关于我**：编辑 `content/about.md`
* **🔗 友情链接**：编辑 `content/links.md`
* **📂 技术专栏**：分类页自动生成，入口文案可在 `content/columns.md` 修改

### 添加新的分类 (Category)
不需要手动创建分类页面。只需在文章的 `categories` 字段中填写新的分类名称，Hugo 会自动生成该分类的索引页。

例如：`categories: ["云原生", "Kubernetes"]`

---

## ⚙️ 4. 常用配置修改

配置文件位于根目录的 `hugo.toml`。

* **修改网站标题**：找到 `title = "..."`
* **修改社交链接**：找到 `[[params.socialIcons]]` 部分
* **修改菜单导航**：找到 `[menu]` 部分
* **修改首页欢迎语**：找到 `[params.homeInfoParams]` 部分

---

## 🚢 5. 发布与维护

### 1. 将文章从草稿转为正式
在文章头部的 Front Matter 中，将 `draft: true` 改为 `draft: false`。

### 2. 发布到 GitHub
完成编辑后，使用 Git 命令提交并推送到远程仓库。

```bash
# 1. 查看修改状态
git status

# 2. 添加所有修改
git add .

# 3. 提交修改说明
git commit -m "新增文章：我的第一篇博客"

# 4. 推送到 GitHub
git push origin main
```

如果是使用 GitHub Pages 自动构建，推送成功后，等待几分钟即可在线上看到更新。

---

## 💡 6. 进阶技巧

### 使用 Shortcodes (短代码)
PaperMod 主题支持一些特殊的短代码来丰富文章展示。

**折叠块 (Collapse):**
```markdown
{{< collapse summary="点击查看详情" >}}
这里是隐藏的内容...
{{< /collapse >}}
```

**原始 HTML (Raw HTML):**
```markdown
{{< rawhtml >}}
<div style="color: red;">这是一段红色文字</div>
{{< /rawhtml >}}
```

### 更换头像
将你的头像图片命名为 `avatar.jpg` (或其他格式)，放入 `static/` 目录下，然后在 `hugo.toml` 中引用它（如果没有配置，可能需要手动添加或者直接替换主题默认图片，具体视配置而定。当前配置未显式指定头像路径，通常在 `static` 下放图即可在文章中引用）。

---

祝你写作愉快！如有问题，请查阅 [Hugo 官方文档](https://gohugo.io/documentation/)。
