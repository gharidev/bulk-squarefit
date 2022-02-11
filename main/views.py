from turtle import color
from django.http import HttpResponseBadRequest, HttpResponse
from django.shortcuts import render
from django.views.generic import View
from django.views.decorators.csrf import csrf_exempt

from .utils import square_fit_image
# Create your views here.

class SquareFitView(View):
    template_name = 'main/index.html'

    @csrf_exempt
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get(self, request):
        return render(request, self.template_name)

    def post(self, request):
        image = request.FILES.get('image')
        if not image:
            return HttpResponseBadRequest()
        color = request.GET.get('color', 'ffffff')
        radius = None
        if not color:
            return HttpResponseBadRequest()
        if color == 'blur':
            radius = int(request.GET.get('radius', '8'))
            if not radius:
                return HttpResponseBadRequest()
        reponse_img = square_fit_image(image, color=color, radius=radius)
        response = HttpResponse(content_type='image/jpg')
        reponse_img.save(response, "JPEG")
        return response