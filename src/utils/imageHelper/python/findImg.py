import os
import json
import cv2

bgImgPath = os.getenv('bgImgPath')
targetImgPath = os.getenv('targetImgPath')

def findImg(bgImgPath, targetImgPath):
    # 将图像转换为灰度图像
    bgImg = cv2.imread(bgImgPath)
    targetImg = cv2.imread(targetImgPath)
    bgImgGray = cv2.cvtColor(bgImg, cv2.COLOR_BGR2GRAY)
    targetImgGray = cv2.cvtColor(targetImg, cv2.COLOR_BGR2GRAY)

    # Apply template Matching
    res = cv2.matchTemplate(bgImgGray, targetImgGray, cv2.TM_CCOEFF_NORMED)
    min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(res)
    
    # 如果最大匹配程度大于阈值,就认为找到了匹配区域
    threshold = 0.8
    if max_val >= threshold:
        # 绘制矩形边框
        top_left = max_loc
        rect = { 
            "rect": {
                "x": top_left[0] + targetImg.shape[1] / 2, 
                "y": top_left[1] + targetImg.shape[0] / 2,
                "width": targetImg.shape[1],
                "height": targetImg.shape[0],
            },
            "match": max_val # 匹配程度
        }
        
        return rect
    else:
        return None, None

print(findImg(bgImgPath, targetImgPath))