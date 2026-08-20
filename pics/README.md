# 图片管理说明

每个需要照片的页面都已拆到单独文件夹。替换照片时，保持文件名不变即可，不用改代码。

## 页面照片路径

| 页面 / 环节 | 放置目录 | 文件名 | 数量 |
| --- | --- | --- | ---: |
| 用手势打开生日蛋糕 | `pics/gesture/` | `01` 到 `06` | 6 张 |
| 时间线放映厅 | `pics/timeline/` | 按 `pics/timeline/manifest.json` 配置 | 不限 |
| 可爱瞬间馆 | `pics/cute/` | 按 `pics/cute/manifest.json` 配置 | 不限 |
| 拍立得相册墙 | `pics/album/` | `01`、`02`、`03`、`04` | 4 张 |
| 生日证书 | `pics/certificate/` | `main-01`、`main-02`、`sticker-left`、`sticker-right`、`sticker-bottom` | 5 张 |
| 祝福环节 | `wishes/friends/` | 按 `wishes/manifest.json` 记录 | 不限 |

## 不需要替换照片的环节

- 开场首页：使用 `assets/birthday-museum-hero.png` 背景图。
- 拆礼物：纯 CSS 礼物和特效，不需要照片。
- 生日心愿扭蛋机：使用 `pics/roco/` 内置的异色精灵奖励图。

## 替换建议

- 文件名保持不变即可，后缀可用 `png`、`jpg`、`jpeg`、`webp` 或 `avif`；网页会自动识别并显示。
- 推荐宽度不低于 `1200px`；手势蛋糕使用 `01` 到 `06`。
- 竖图、横图都可以；各页面会按各自画框展示，推荐保留人物主体在画面中央。
- 祝福截图替换后，运行 `wishes/update-manifest.ps1` 更新清单。

## 时间线与可爱瞬间的多图配置

每个时间点（或瞬间）可以有任意多张照片。没有强制命名格式；唯一规则是：`manifest.json` 里的照片名必须和文件的**基础名**完全一致，且不写扩展名。

推荐按「数字前缀 + 连字符序号」命名，后续管理最清楚。第一个时间节点可这样放：

```text
pics/timeline/01-01.png
pics/timeline/01-02.jpg
pics/timeline/01-03.webp
```

然后编辑 `pics/timeline/manifest.json` 对应节点：

```json
{
  "year": "2021",
  "title": "第一次被记住的瞬间",
  "text": "这里写该时间点的文字。",
  "photos": ["01-01", "01-02", "01-03"]
}
```

第二个节点可继续使用 `02-01`、`02-02`；可爱瞬间馆则可用 `01-01`、`01-02`、`02-01` 这样的同类数字命名，并在 `pics/cute/manifest.json` 对应 `photos` 数组写入相同名称。

- 想增加新的时间线或瞬间，直接在对应清单的 `groups` 里复制一项、修改文字和 `photos`；左边列表会自动生成，右边照片切换也会自动支持。
- 清单中的照片名不写后缀；每张都可使用 `png`、`jpg`、`jpeg`、`webp` 或 `avif`。
