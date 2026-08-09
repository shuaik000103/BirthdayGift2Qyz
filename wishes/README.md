# 好友生日祝福截图

把所有聊天截图复制到 `wishes/friends/`，支持 `.jpg`、`.jpeg`、`.png`、`.webp`、`.gif`。

复制完成后，在项目根目录运行：

```powershell
powershell -ExecutionPolicy Bypass -File .\wishes\update-manifest.ps1
```

脚本会自动按文件名排序并更新 `wishes/manifest.json`。网页会优先从这个清单抽取祝福图片；图片尺寸不一致没关系，页面会用 `object-fit: contain` 完整展示，不会裁掉聊天截图。
