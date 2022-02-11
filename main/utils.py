from PIL import Image, ImageColor, ImageFilter

SQUARE_DIM = 2048


def square_fit_image(image, dim=SQUARE_DIM, color='ffffff', radius=8):
    if color == 'dominant':
        base_img = Image.new("RGB", (dim, dim), get_dominant_color(image))
    elif color == 'blur':
        img = Image.open(image)
        img = center_crop_image(img)
        img = img.resize((dim, dim), Image.ANTIALIAS)
        base_img = img.filter(ImageFilter.GaussianBlur(radius))
    else:
        base_img = Image.new("RGB", (dim, dim), ImageColor.getrgb(f'#{color}'))
    image = Image.open(image)
    ratio = min(dim/image.width, dim/image.height)
    image = image.resize((int(image.width*ratio), int(image.height*ratio)), Image.ANTIALIAS)
    if image.width > image.height:
        height = image.height
        start_y = int(dim/2-height/2)
        base_img.paste(image, (0, start_y))
    else:
        width = image.width
        start_x = int(dim/2-width/2)
        base_img.paste(image, (start_x, 0))
    return base_img

def center_crop_image(image):
    width, height = image.size   # Get dimensions
    dim = min(width, height)
    if width>height:
        top = 0
        bottom = dim
        left = (width-dim)/2
        right = ((width-dim)/2) + dim
    else:
        left = 0
        right = dim
        top = (height-dim)/2
        bottom = ((height-dim)/2) + dim
    return image.crop((left, top, right, bottom))

def get_dominant_color(img, palette_size=16):
    # Resize image to speed up processing
    img = Image.open(img)
    img.thumbnail((100, 100))

    # Reduce colors (uses k-means internally)
    paletted = img.convert('P', palette=Image.ADAPTIVE, colors=palette_size)

    # Find the color that occurs most often
    palette = paletted.getpalette()
    color_counts = sorted(paletted.getcolors(), reverse=True)
    palette_index = color_counts[0][1]
    dominant_color = palette[palette_index*3:palette_index*3+3]

    return tuple(dominant_color)