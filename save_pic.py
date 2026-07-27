import os
from PIL import Image, ImageDraw, ImageFont
import random


def create_tip_image(tip_text, index, save_path):
    """创建单个提示图片并保存"""
    # 图片大小
    width = 250
    height = 60

    # 随机背景颜色
    bg_colors = [
        (255, 182, 193),  # lightpink
        (135, 206, 235),  # skyblue
        (144, 238, 144),  # lightgreen
        (230, 230, 250),  # lavender
        (255, 255, 224),  # lightyellow
        (221, 160, 221),  # plum
        (255, 127, 80),  # coral
        (255, 228, 196),  # bisque
        (127, 255, 212),  # aquamarine
    ]
    bg = random.choice(bg_colors)

    # 创建图片
    image = Image.new('RGB', (width, height), bg)
    draw = ImageDraw.Draw(image)

    # 尝试使用中文字体，如果找不到则使用默认字体
    try:
        # 使用系统字体，Windows下可以使用微软雅黑
        font = ImageFont.truetype("msyh.ttf", 16)  # 微软雅黑
    except:
        try:
            font = ImageFont.truetype("simsun.ttc", 16)  # 宋体
        except:
            font = ImageFont.load_default()

    # 计算文字位置（居中）
    # 使用textbbox获取文字边界
    bbox = draw.textbbox((0, 0), tip_text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x = (width - text_width) // 2
    y = (height - text_height) // 2

    # 绘制文字（黑色）
    draw.text((x, y), tip_text, fill=(0, 0, 0), font=font)

    # 保存图片
    filename = f"blessing_{index:02d}.png"
    filepath = os.path.join(save_path, filename)
    image.save(filepath, "PNG")
    print(f"已保存: {filename}")

    return filepath


def generate_all_blessings():
    """生成所有祝福语图片"""
    tips = [
        '愿深海的祝福与你我同在', '我想看的世界，在你眼里', '我心甘情愿被你困住',
        '下次一起去看海吧', '脸颊沾到颜料的你很可爱', '聊天记录是三万行情书', '早安，我的小保镖',
        '海风能吹散所有烦恼', '期待下一次见面', '喂喂喂，猜猜我是谁？',
        '画累了，需要见面充能', '我祝你，希望永不灭', '愿所有烦恼都消失',
        '又见面了，保镖小姐', '我的小鱼已经认识你了', '你相信，海底也会燃起火焰吗',
        '我想看的世界，在你眼里', '只是摸两下耳朵可不够', '会好起来的', '答应过你的，绝不会失约',
        '你是我唯一的选择', '你需要的话，我随时有空', '你从来都不是可怕的女巫', '想要哪条鱼，全都抓给你',
        '我祝你，希望永不灭', '要对你救助的小动物负责哦', '只要你会来，等待就值得',
        '我对你产生意义了吗', '明年，我要你对我更贪心一点', '那就和我在一起，溺死在同一片海里吧'
    ]

    # 保存路径
    save_path = r"D:\Software\AndroidProjects\BirthdayGift\app\src\main\res\drawable-nodpi"

    # 确保目录存在
    if not os.path.exists(save_path):
        os.makedirs(save_path)
        print(f"创建目录: {save_path}")

    # 生成所有图片（索引从3开始到32）
    for i, tip in enumerate(tips, start=3):
        create_tip_image(tip, i, save_path)

    print(f"\n所有图片已保存到: {save_path}")
    print(f"共生成 {len(tips)} 张图片 (blessing_03 到 blessing_{len(tips) + 2})")


if __name__ == "__main__":
    generate_all_blessings()