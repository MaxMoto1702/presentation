define(['jsx/CallBacks'], function() {
   
    if (typeof LiveTex === 'undefined') {
        return;
    }

    LiveTex.onLiveTexReady = function() {
        var name = [LiveTex.hhPrechat.user.lastName, LiveTex.hhPrechat.user.firstName, LiveTex.hhPrechat.user.midName];

        name = name.join(' ').replace(/\s{2,}/g, ' ');
        LiveTex.setName(name, function(){});

        this.haveOnlineOperators(function(opers) {
            var filteredOpers = [];

            opers.forEach(function(oper) {
                LiveTex.hhGroups.forEach(function(group) {
                    if (!filteredOpers[oper] && oper.state_id === 1 && oper.department_id.indexOf(group) !== -1) {
                        filteredOpers.push(oper);
                    }
                });
            });

            if (filteredOpers.length) {
                var randomNumber = Math.floor(Math.random()*filteredOpers.length);
                LiveTex.hhOper = filteredOpers[randomNumber].id;
                LiveTex.initComplete();
            }

        });

    }

    LiveTex.hhOpenChat = function() {
        LiveTex.openWelcomeWindow(LiveTex.hhOper, LiveTex.hhPrechat.user, LiveTex.hhPrechat.system);
    }

    LiveTex.initComplete = function() {
        jsx.CallBacks.need(['HH/LiveTex'], function(){
            jsx.CallBacks.dispatch('HH-LiveTex-Loaded');
        }, HH);
    }

    //этот скрипт должен подгрузиться строго после инициализации объекта LiveTex.
    var livetexurl = 'http://cs15.livetex.ru/js/api.js';
    requirejs([livetexurl], function() {}, function() {requirejs.undef(livetexurl)});
});
