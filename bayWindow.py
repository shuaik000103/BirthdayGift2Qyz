# 导入所需模块
import random
import time
from PIL import Image, ImageDraw, ImageFont
import os


def create_tip_image(tip_text, index):
    """直接生成祝福语图片，保存到指定Android项目路径"""
    try:
        # 使用您指定的保存路径
        save_dir = r"D:\Software\AndroidProjects\BirthdayGift\app\src\main\res\drawable-nodpi"

        # 如果路径不存在则创建
        if not os.path.exists(save_dir):
            os.makedirs(save_dir)
            print(f"已创建文件夹: {save_dir}")

        # 设置图片尺寸
        img_width = 400
        img_height = 150

        # 随机背景颜色
        bg_colors = [
            (255, 182, 193), (135, 206, 235), (144, 238, 144), (230, 230, 250),
            (255, 255, 224), (221, 160, 221), (255, 127, 127), (255, 228, 196), (127, 255, 212)
        ]
        bg_color = random.choice(bg_colors)

        # 创建纯色背景图片
        img = Image.new('RGB', (img_width, img_height), bg_color)
        draw = ImageDraw.Draw(img)

        # 设置字体
        try:
            font = ImageFont.truetype("msyh.ttc", 28)
        except:
            try:
                font = ImageFont.truetype("simsun.ttc", 28)
            except:
                font = ImageFont.load_default()

        # 计算文本位置（居中）
        text_bbox = draw.textbbox((0, 0), tip_text, font=font)
        text_width = text_bbox[2] - text_bbox[0]
        text_height = text_bbox[3] - text_bbox[1]

        # 如果文本太长，分行显示
        if text_width > img_width - 40:
            lines = []
            current_line = ""
            for char in tip_text:
                test_line = current_line + char
                test_bbox = draw.textbbox((0, 0), test_line, font=font)
                if test_bbox[2] - test_bbox[0] > img_width - 40:
                    lines.append(current_line)
                    current_line = char
                else:
                    current_line = test_line
            if current_line:
                lines.append(current_line)

            total_height = len(lines) * (text_height + 10)
            y_start = (img_height - total_height) // 2

            for i, line in enumerate(lines):
                line_bbox = draw.textbbox((0, 0), line, font=font)
                line_width = line_bbox[2] - line_bbox[0]
                x = (img_width - line_width) // 2
                y = y_start + i * (text_height + 10)
                draw.text((x, y), line, fill='black', font=font)
        else:
            x = (img_width - text_width) // 2
            y = (img_height - text_height) // 2
            draw.text((x, y), tip_text, fill='black', font=font)

        # 添加装饰边框
        draw.rectangle([5, 5, img_width - 5, img_height - 5], outline='gray', width=2)

        # 保存图片（使用指定的命名规则：blessing_3 到 blessing_12）
        filename = f"blessing_{index}.png"
        full_path = os.path.join(save_dir, filename)
        img.save(full_path)
        print(f"✓ 图片已保存: {full_path}")

    except Exception as e:
        print(f"✗ 生成图片失败: {e}")


def show_warm_tips():
    """批量生成祝福语图片"""
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

    print(f"开始生成祝福语图片...")
    print(f"保存位置: D:\\Software\\AndroidProjects\\BirthdayGift\\app\\src\\main\\res\\drawable-nodpi")
    print("-" * 60)

    # 生成图片 blessing_3 到 blessing_12（共10张）
    for i in range(3, 13):  # 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
        tip = random.choice(tips)
        create_tip_image(tip, i)
        time.sleep(0.1)

    print("-" * 60)
    print(f"✅ 所有图片生成完成！")


if __name__ == "__main__":
    show_warm_tips()