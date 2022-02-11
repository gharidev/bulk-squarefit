from PIL import Image

SQUARE_DIM = 2048


def square_fit_image(image, dim=SQUARE_DIM):
    base_img = Image.new("RGB", (dim, dim), (255, 255, 255))
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
