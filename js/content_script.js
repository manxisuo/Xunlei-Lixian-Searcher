// 获取用户ID
var UID = location.href.match(/userid=(\d+)/)[1];

// 任务列表容器
var $scroller = $('#scroller');

// 提示信息框容器
var $tipBox = $('#w_tip_box');

// 封装本地存储的存/取方法
var storage = {
    set: function(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    get: function(key) {
        return JSON.parse(localStorage.getItem(key));
    }
};

// 生成查询任务的URL
function makeUrl(uid, page) {
    return `http://dynamic.cloud.vip.xunlei.com/user_task?userid=${uid}&st=4&p=${page}`;
}

// 生成某个任务对应的HTML
function getTaskHtml(task) {
    var html =
        `
    <div class="rw_list" id="tr_c${task.taskid}" openformat="${task.openformat}" taskid="${task.taskid}" data-blocked="0" style="cursor: pointer;">
        <div class="rw_inter">
            <div class="w01">
                <div class="w01sel">
                    <input name="ck" id="input${task.taskid}" type="checkbox" value="${task.taskid}" class="in_ztclick" database="0">
                </div>
            </div>
            <div class="w02">
                <div class="rwicbox">
                    <em id="statuscss${task.taskid}" class="rwicimg rwicok"></em>
                </div>
            </div>
            <div class="w03">
                <div class="w03img">
                    <img class="${task.typeClass}" src="${task.typeSrc}">
                </div>
            </div>
            <div class="w04">
                <div class="rw_infoname">
                    <p id="tname_a${task.taskid}">
                        <span class="namelink">
                            <span dbclick="1" check="1" taskid="${task.taskid}" href="#" title="${task.name}">${task.name}</span>
                        </span>
                    </p>
                    <p>
                        <span class="rw_gray" id="size${task.taskid}">2.89G</span>
                    </p>
                    <div class="rwset" id="rwset" taskid="${task.taskid}">
                        <p><a href="#" class="rwbtn ic_redownloca" onclick="_hmt1.push(['_trackEvent','task','down_task','taskbar']);thunder_download(${task.taskid});close_rightmenu_layer();return false;" title="">取回本地</a></p>
                        <div class="yun_btnbox" style="display: ${task.openformat === 'movie' ? 'block' : 'none'}">
                            <span class="yunlink"><a href="#" class="link_yuntxt" onclick="_hmt1.push(['_trackEvent','task','vodopen_task','taskbar']);open_task_new(${task.taskid},'movie',0,'cloudp');close_rightmenu_layer();return false;" title="">边下边播</a>
                            </span>
                        </div>
                        <a href="#" style="display: ${task.openformat === 'bt' ? 'block' : 'none'}" onclick="_hmt1.push(['_trackEvent', 'task', 'open_task', 'taskbar']);bt_list_show('${task.dcid}',${task.taskid});return false;" class="rwbtn ic_open" title="">打开</a>
                        <p></p>
                    </div>
                </div>
            </div>
            <div class="w05">
                <div class="rwjindu">
                    <div class="loadbar">
                        <span class="barpar" style="width:${task.progress}"></span>
                        <em class="loadnum">${task.progress}</em>
                    </div>
                    <div class="sub_barinfo">
                        <em class="infomag rw_gray info_col01">已自动续期</em>
                    </div>
                </div>
            </div>
            <div class="w07">
                <div style="padding-top:4px">
                    <p>
                        <span class="c_addtime">${task.date}</span>
                    </p>
                </div>
            </div>
            <input id="d_status${task.taskid}" type="hidden" value="${task.d_status}">
            <input id="dflag${task.taskid}" name="dflag" type="hidden" value="${task.dflag}">
            <input id="durl${task.taskid}" type="hidden" title="${task.name}" value="${task.name}">
            <input id="dcid${task.taskid}" name="cidlist" type="hidden" value="${task.dcid}">
            <input id="dl_url${task.taskid}" type="hidden" value="${task.dl_url}">
            <input id="bt_down_url${task.taskid}" type="hidden" value="${task.bt_down_url}">
            <input id="bt_movie${task.taskid}" type="hidden" value="0">
            <input id="f_url${task.taskid}" type="hidden" value="${task.f_url}">
            <input id="d_status${task.taskid}" type="hidden" value="${task.d_status}">
            <input id="d_tasktype${task.taskid}" type="hidden" value="${task.d_tasktype}">
            <input id="taskname${task.taskid}" type="hidden" value="${task.name}">
            <input id="ref_url${task.taskid}" type="hidden" value="${task.ref_url}">
            <input id="ysfilesize${task.taskid}" type="hidden" value="${task.ysfilesize}">
            <input id="verif${task.taskid}" type="hidden" value="${task.verif}">
            <input id="ifvod${task.taskid}" type="hidden" value="${task.ifvod}">
            <input id="vodurl2${task.taskid}" type="hidden" value="${task.vodurl2}">
            <input id="openformat${task.taskid}" type="hidden" value="${task.openformat}">
        </div>
    </div>
    `;

    return html;
}

// 查询某页的任务列表
function query(uid, page) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: makeUrl(uid, page),
            cache: false,
            timeout: 10000,
            success: resolve,
            error: reject
        })
    }).then(resp => {
        var tasks = [];
        $(resp).find('.rw_list').each((index, ele) => {
            var $this = $(ele);
            var taskid = $this.attr('taskid');
            tasks.push({
                taskid: taskid,
                name: $this.find('.w04:first').find('.namelink').text(),
                date: $this.find('.w07:first').text(),
                typeClass: $this.find('.w03img img').attr('class'),
                typeSrc: $this.find('.w03img img').attr('src'),
                progress: $this.find('.rwjindu .loadnum').text(),
                d_status: $this.find(`#d_status${taskid}`).val(),
                dflag: $this.find(`#dflag${taskid}`).val(),
                durl: $this.find(`#durl${taskid}`).val(),
                dcid: $this.find(`#dcid${taskid}`).val(),
                dl_url: $this.find(`#dl_url${taskid}`).val(),
                bt_down_url: $this.find(`#bt_down_url${taskid}`).val(),
                bt_movie: $this.find(`#bt_movie${taskid}`).val(),
                f_url: $this.find(`#f_url${taskid}`).val(),
                d_tasktype: $this.find(`#d_tasktype${taskid}`).val(),
                taskname: $this.find(`#taskname${taskid}`).val(),
                ref_url: $this.find(`#ref_url${taskid}`).val(),
                ysfilesize: $this.find(`#ysfilesize${taskid}`).val(),
                verif: $this.find(`#verif${taskid}`).val(),
                ifvod: $this.find(`#ifvod${taskid}`).val(),
                vodurl2: $this.find(`#vodurl2${taskid}`).val(),
                openformat: $this.find(`#openformat${taskid}`).val()
            });
        });

        return Promise.resolve(tasks);
    });
};

// 等待。为了防止请求过快被迅雷封禁。
function wait(time) {
    return function(data) {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                resolve(data);
            }, time);
        });
    }
}

// 显示提示信息
function showTip(tip, period) {
    $tipBox.children('p.tipbg').text(tip).end().show()
    if (period) {
        setTimeout(function() {
            $tipBox.hide();
        }, period);
    }
}

// 隐藏提示信息
function hideTip() {
    $tipBox.hide();
}

// 重建索引
function recreateIndex() {
    var flagTaskid = null;
    var allTasks = [];

    function queryPage(p) {
        return query(UID, p).then(wait(400)).then(tasks => {
            showTip(`正在建立索引(第${p}页)，请稍等...`);

            if (tasks.length > 0 && tasks[0].taskid !== flagTaskid) {
                flagTaskid = tasks[0].taskid;
                allTasks = allTasks.concat(tasks);
                return queryPage(p + 1);
            } else {
                return allTasks;
            }
        })
    }

    storage.set('tasks', {});

    showTip(`正在建立索引，请稍等...`);

    queryPage(1).then(tasks => {
        storage.set('tasks', tasks);
        hideTip();
    }, reason => {
        showTip('出现未知错误', 3000);
    });
}

// 执行搜索动作
function doSearch() {
    showTip('搜索中...');

    $scroller.empty();

    var keyword = $.trim($('#search_box').val());
    if (keyword) {
        var tasks = storage.get('tasks') || {};
        var fuzzy = new FuzzySearch(tasks, ['name'], {
            caseSensitive: false,
            sort: false
        });
        var results = fuzzy.search(keyword);
        results.forEach(task => {
            $scroller.append(getTaskHtml(task));
        });
    }

    hideTip();
}

// 插入搜索框等界面元素，并注册事件监听器。
$('#main_nav > ul:first').append(
    `
    <li>
        <input id="search_box" placeholder="输入关键词" />
        <button id="search_btn">搜索</button>
        <button id="index_btn">重建索引</button>
    </li>
    `
).find('#search_btn').click(doSearch).end().find('#search_box').keypress(function(e) {
    e.keyCode === 13 && doSearch();
}).end().find('#index_btn').click(recreateIndex);
