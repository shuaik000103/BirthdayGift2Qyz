# BirthdayGift2Qyz

这是一个静态生日网页项目，可直接部署到 GitHub Pages。

## 公开访问网址

当前仓库名为 `BirthdayGift2Qyz`，GitHub 用户名为 `shuaik000103`，启用 GitHub Pages 后默认访问地址是：

`https://shuaik000103.github.io/BirthdayGift2Qyz/`

## 部署方式

1. 将本项目推送到 GitHub 的 `main` 或 `master` 分支。
2. 打开仓库 `Settings` → `Pages`。
3. 在 `Build and deployment` 里把 `Source` 选择为 `GitHub Actions`。
4. 回到 `Actions`，等待 `Deploy to GitHub Pages` 工作流执行完成。

项目已包含 `.github/workflows/deploy-pages.yml`，后续每次推送都会自动重新部署。

## 网址能否自己命名

- 免费 GitHub Pages 地址的域名固定是 `shuaik000103.github.io`。
- `/BirthdayGift2Qyz/` 这一段来自仓库名；如果改仓库名，路径也会变。
- 如果想使用完全自定义的网址，例如 `https://happy-birthday.example.com`，需要购买或拥有域名，然后在 GitHub Pages 里绑定自定义域名并配置 DNS。

## 注意

当前页面直接加载 `pics/` 里的照片，不再进行浏览器端解密。公开仓库会公开这些照片，请只上传可以公开访问的图片。
