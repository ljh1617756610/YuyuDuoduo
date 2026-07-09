from django.shortcuts import render


def home(request):
    # 渲染 Vue 构建产物 frontend/dist/index.html，由 Django 托管前端静态文件
    return render(request, 'index.html')


# Create your views here.
