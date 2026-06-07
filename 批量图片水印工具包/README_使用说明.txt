批量图片水印工具包
==================

一、最快用法
1. 解压整个工具包。
2. 把图片放进 input 文件夹。
3. 双击 一键加水印.bat。
4. 到 output 文件夹查看生成结果。

二、当前默认效果
- 水印文字：图明索高清调试
- 字体：Noto Sans SC（开源中文黑体，已随工具包附带）
- 字号：小四，等效 12pt / 16px
- 透明度：80%
- 位置：图片中部，左侧 / 中间 / 右侧三处
- 输出：output\水印结果_时间戳

三、修改参数
打开 config.ini 可修改：

WatermarkText=图明索高清调试
Position=middle-sides
Opacity=80
FontSize=small4

常用位置：
- middle-sides：图片中部，左 / 中 / 右
- br：右下角
- bl：左下角
- tr：右上角
- tl：左上角
- center：居中
- tile：常规平铺
- diamond：大菱形排列

常用字号：
- small4：小四，约 12pt / 16px
- small5：小五，约 9pt / 12px
- 12pt：按点数
- 16px：按像素
- 5：按图片短边 5% 自适应

四、拖拽/命令行用法
可以把某个图片文件夹拖到 一键加水印.bat 上。

也可以在命令行运行：
一键加水印.bat "D:\图片目录"
一键加水印.bat "D:\图片目录" "D:\输出目录"

五、注意事项
- 不会覆盖原图。
- 不依赖 ImageMagick / ffmpeg。
- 需要 Windows 自带 PowerShell。
- 如果把工具包发给别人，请保持 fonts 文件夹和 tools 文件夹一起发送。
