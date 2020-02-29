window.onload = function() {

    //实现导航部分的动画效果，css中navline必须有定位

    //1.获取元素，滑块元素和ls元素，因为鼠标经过li，滑块需动画滑过
    var navline = document.querySelector('#navline');
    var lis = document.querySelectorAll('.top-nav-li');
    var uls = document.querySelector('.nav');

    //2.滑块滑动，循环 lis
    for (var i = 0; i < lis.length; i++) {
        //3.添加鼠标滑过事件
        lis[i].addEventListener('mouseenter', function() {
                //将navline进行移动，offsetLeft获取左边距离
                navline.style.left = animate(navline, this.offsetLeft);
                //更新navline的宽度，因为每一个li的宽度不一样
                navline.style.width = this.offsetWidth + 'px';
                //如果有下拉菜单（因为有的lis没有下拉菜单）
                //鼠标移入时，显示下拉菜单，下拉菜单是li里面的第二个元素
                if (this.children[1]) {
                    this.children[1].style.display = 'block';
                }
            })
            //4.当鼠标离开li时
        lis[i].addEventListener('mouseleave', function() {
            uls.children[0].style.left = animate(navline, uls.children[0].offsetLeft);
            navline.style.width = uls.children[0].offsetWidth + 'px';
            this.children[1].style.display = 'none';

        })
    }

    //封装动画函数，需要两个参数，动画对象和动画距离
    function animate(obj, target) {
        clearInterval(obj.timer);
        obj.timer = setInterval(function() {
            //缓动动画的公式: 步长=(目标-现在的位置) / 10
            var step = (target - obj.offsetLeft) / 10;
            //把步长值取整数，为了达到目标位置，判断大于0是为了可以前进和后退
            step = step > 0 ? Math.ceil(step) : Math.floor(step);
            if (obj.offsetLeft == target) {
                clearInterval(obj.timer);
            }
            obj.style.left = obj.offsetLeft + step + 'px';
        }, 10)
    }

    //轮播图效果

    //1.获取元素,banner里面的ul；banner里面的图片个数就是li个数；小圆点，
    var banner = document.querySelector('#banner');
    var ul = banner.querySelector('#publish-copy');
    var dot = document.querySelector('#b_dot');
    var imgs = banner.querySelector('li');
    //获取图片的宽度
    var imgWidth = imgs.offsetWidth;

    //2.循环ul里面的li
    for (var i = 0; i < ul.children.length; i++) {

        //1.创建小圆点,需要写在循环里面，实现动态创建
        var a = document.createElement('a');
        //2.设置a的索引号，为了点击a可以切换到相应的图片
        a.setAttribute('index', i);
        //3.将a添加到dot中
        dot.appendChild(a);

        //4.小圆点的排他思想
        a.addEventListener('click', function() {
            //当点击a时，干掉所有人
            for (var i = 0; i < dot.children.length; i++) {
                dot.children[i].className = '';
            }
            //留下我自己
            this.className = 'on';

            //5.点击小圆点时，移动图片，移动ul
            //点击a，获得上面设置的索引号
            var index = this.getAttribute('index');
            //用封装的动画效果滑动图片,向左移动图片宽度
            animate(ul, -index * imgWidth);
            //因为index为局部变量，所以声明一个全局变量，num为图片的index，circle为小圆点的index
            num = index;
            circle = index;
        })
    }

    //3.将第一个小圆点设置on样式
    dot.children[0].className = 'on';

    //4.实现图片最后一张和第一张的无缝连接
    //克隆第一张图片，放到最后一张的后面，第一章图片在ul里面第一个li里，深拷贝
    var first = ul.children[0].cloneNode(true);
    ul.appendChild(first);

    //5.实现自动播放效果
    //设置num和circle的初始值
    var num = 0;
    var circle = 0;
    //开启定时器
    var timer = setInterval(function() {
        auto();
    }, 2000)

    //6.鼠标经过，停止定时器
    ul.addEventListener('mouseenter', function() {
        clearInterval(timer);
    });

    //7.鼠标离开，开启定时器
    ul.addEventListener('mouseleave', function() {
        timer = setInterval(function() {
            auto();
        }, 2000);
    });

    //封装一个自动播放的函数
    function auto() {
        //1.图片滚动到复制的一张，将ul的left设置为0
        if (num == ul.children.length - 1) {
            ul.style.left = 0;
            //再将num设置为0
            num = 0;
        }
        num++;
        animate(ul, -num * imgWidth);

        //2.实现小圆点的跟随变化
        //小圆点在第一张开始滚动时变化
        circle++;
        //先判断是否是最后一张图片
        if (circle == dot.children.length) {
            circle = 0;
        }
        //再进行排他思想
        for (var i = 0; i < dot.children.length; i++) {
            //干掉其他
            dot.children[i].className = '';
        }
        //留下自己
        dot.children[circle].className = 'on';
    }
}