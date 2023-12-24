import os
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
        bottom_right = (top_left[0] + targetImg.shape[1], top_left[1] + targetImg.shape[0])
        cv2.rectangle(bgImg, top_left, bottom_right, 255, 2)
        
        # 返回匹配区域左上角坐标和匹配程度
        return top_left, bottom_right, max_val
    else:
        return None, None

print(searchImg('1.jpg', '2.jpg'))