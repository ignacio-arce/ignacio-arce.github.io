    function escape(s) {
        var n = s;
        n = n.replace(/&/g, "&amp;");
        n = n.replace(/</g, "&lt;");
        n = n.replace(/>/g, "&gt;");
        n = n.replace(/"/g, "&quot;");
        return n;
    }
    function diffString(o, n) {
        o = o.replace(/\s+$/, '');
        n = n.replace(/\s+$/, '');
        var out = diff(o == "" ? [] : o.split(/\s+/), n == "" ? [] : n.split(/\s+/));
        var str = "";
        var oSpace = o.match(/\s+/g);
        if (oSpace == null) {
            oSpace = ["\n"];
        } else {
            oSpace.push("\n");
        }
        var nSpace = n.match(/\s+/g);
        if (nSpace == null) {
            nSpace = ["\n"];
        }
        else {
            nSpace.push("\n");
        }
        if (out.n.length == 0) {
            for (var i = 0; i < out.o.length; i++) {
                str += '<del>' + escape(out.o[i]) + oSpace[i] + "</del>";
            }
        } else {
            if (out.n[0].text == null) {
                for (n = 0; n < out.o.length && out.o[n].text == null; n++) {
                    str += '<del>' + escape(out.o[n]) + oSpace[n] + "</del>";
                }
            }
            for (var i = 0; i < out.n.length; i++) {
                if (out.n[i].text == null) {
                    str += '<ins>' + escape(out.n[i]) + nSpace[i] + "</ins>";
                } else {
                    var pre = "";
                    for (n = out.n[i].row + 1; n < out.o.length && out.o[n].text == null; n++) {
                        pre += '<del>' + escape(out.o[n]) + oSpace[n] + "</del>";
                    }
                    str += " " + out.n[i].text + nSpace[i] + pre;
                }
            }
        }
        return str;
    }

    function diff(o, n) {
        var ns = new Object();
        var os = new Object();
        for (var i = 0; i < n.length; i++) {
            if (ns[n[i]] == null) ns[n[i]] = {
                rows: new Array(),
                o: null
            };
            ns[n[i]].rows.push(i);
        }
        for (var i = 0; i < o.length; i++) {
            if (os[o[i]] == null) os[o[i]] = {
                rows: new Array(),
                n: null
            };
            os[o[i]].rows.push(i);
        }
        for (var i in ns) {
            if (ns[i].rows.length == 1 && typeof (os[i]) != "undefined" && os[i].rows.length == 1) {
                n[ns[i].rows[0]] = {
                    text: n[ns[i].rows[0]],
                    row: os[i].rows[0]
                };
                o[os[i].rows[0]] = {
                    text: o[os[i].rows[0]],
                    row: ns[i].rows[0]
                };
            }
        }
        for (var i = 0; i < n.length - 1; i++) {
            if (n[i].text != null && n[i + 1].text == null && n[i].row + 1 < o.length && o[n[i].row + 1].text == null && n[i + 1] == o[n[i].row + 1]) {
                n[i + 1] = {
                    text: n[i + 1],
                    row: n[i].row + 1
                };
                o[n[i].row + 1] = {
                    text: o[n[i].row + 1],
                    row: i + 1
                };
            }
        }
        for (var i = n.length - 1; i > 0; i--) {
            if (n[i].text != null && n[i - 1].text == null && n[i].row > 0 && o[n[i].row - 1].text == null && n[i - 1] == o[n[i].row - 1]) {
                n[i - 1] = {
                    text: n[i - 1],
                    row: n[i].row - 1
                };
                o[n[i].row - 1] = {
                    text: o[n[i].row - 1],
                    row: i - 1
                };
            }
        }
        return { o: o, n: n };
    }
    
    Dropzone.autoDiscover = false;

    function initFileZones() {
        var confDoc1 = {
            url: pdf24.workerServer.getUploadUrl(),
            maxFiles: 1,
            maxFilesize: 500,
            timeout: 3600 * 1000,
            acceptedFiles: 'application/pdf,application/msword,application/postscript,application/vnd.ms-excel,application/vnd.ms-powerpoint,application/vnd.oasis.opendocument.graphics,application/vnd.oasis.opendocument.graphics-template,application/vnd.oasis.opendocument.presentation,application/vnd.oasis.opendocument.presentation-template,application/vnd.oasis.opendocument.spreadsheet,application/vnd.oasis.opendocument.spreadsheet-template,application/vnd.oasis.opendocument.text,application/vnd.oasis.opendocument.text-template,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.openxmlformats-officedocument.presentationml.template,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.spreadsheetml.template,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.wordprocessingml.template,application/xhtml+xml,image/bmp,image/gif,image/jpeg,image/png,image/svg+xml,image/tiff,image/x-emf,image/x-wmf,text/html,text/plain,.pdf,.bmp,.doc,.docx,.dot,.dotx,.emf,.gif,.htm,.html,.jb2,.jbig2,.jpeg,.jpg,.odg,.odp,.ods,.odt,.otg,.otp,.ots,.ott,.pbm,.pcx,.pgm,.png,.pot,.potx,.ppm,.pps,.ppt,.pptx,.ps,.rtf,.svg,.tif,.tiff,.txt,.wbmp,.wmf,.xhtml,.xls,.xlsx,.xlt,.xltx,.xlw',
            init: function () {
                this.on("addedfile", function (file) {
                    var pe = $(file.previewElement);
                    pe.find('.dz-filename').after(pe.find('.dz-size'));
                    pdf24.setTooltip(pe.find('.dz-remove'), 'Remover archivo');
                    $('.note.terms').remove();
                });
                this.on("queuecomplete", onQueueComplete);
                this.on("success", function (file,
                    response) {
                    file.serverFile = response[0];
                    var p = $(file.previewElement);
                    p.find('.dz-filename').after(p.find('.dz-size'));
                });
                this.on("drop", function () {
                    pdf24.trackPageEvent('UI',
                        'FileDrop', '');
                });
                $(this.element).addClass('initialized');
            }
        };
        $('#fileZoneDoc1').dropzone(confDoc1);
        var confDoc2 = $.extend({}, confDoc1);
        $('#fileZoneDoc2').dropzone(confDoc2);
    }

    function onQueueComplete() {
        var oneZoneEmpty = pdf24.getServerFilesForFileZone('#fileZoneDoc1').length == 0 ||
                pdf24.getServerFilesForFileZone('#fileZoneDoc2').length == 0;
        $('#form').show();
        $('#form').toggleClass('disabled',
            oneZoneEmpty);
    }

    function diffFiles(serverFile1, serverFile2) {
        var loader = pdf24.showLoader('#textDiffResult .loader', 'width:50px');
        var textResults = {
            file1: null,
            file2: null
        };
        var doCheck = function () {
            if (textResults.file1 && textResults.file2) {
                var diffRes =
                    diffString(textResults.file1, textResults.file2);
                $('#textDiffResult').html(diffRes);
            }
        }
        pdf24.workerServer.doGetFile(serverFile1, function (res) {
            textResults.file1 = res;
            doCheck();
        });
        pdf24.workerServer.doGetFile(serverFile2, function (res) {
            textResults.file2 = res;
            doCheck();
        });
    }

    function comparePdf() {
        var filesDoc1 = pdf24.getServerFilesForFileZone('#fileZoneDoc1');
        var filesDoc2 =
            pdf24.getServerFilesForFileZone('#fileZoneDoc2');
        if (filesDoc1.length == 0 && filesDoc2.length == 0) {
            return;
        }
        $('#form').hide();
        pdf24.workerServer.doPostJson('convertPdfTo', {
            files: [filesDoc1[0], filesDoc2[0]],
            outputFileType: 'txt',
            conversionMode: 'simple',
            byteOrderMark: false
        }, function (result) {
            var monitorUrl =
                pdf24.workerServer.getJobMonitorUrl({
                    jobId: result.jobId,
                    clientAppMonitored: 1
                });
            pdf24.initAndShowWorkerZone(monitorUrl);
            pdf24.monitorJobState({
                jobId: result.jobId,
                finish: function (result) {
                    $('#workerZone').addHidden();
                    $('#resultZone').show();
                    diffFiles(result.job['0.out'], result.job['1.out']);
                },
                error: function (xhr) {
                    $('#workerZone').addHidden();
                    $('#form').show();
                    alert('Lo sentimos, ocurrió un error.');
                }
            });
        }, function (xhr) {
            $('#workerZone').addHidden();
            $('#form').show();
            alert('Lo sentimos, ocurrió un error.');
        });
        pdf24.trackPageEvent('ToolUsage', 'ResultGeneration', '');
        pdf24.addLastUsedTool('comparePdf');
    }
    $(function () {
        pdf24.selectWorkerServer({
            pageId: 'comparePdf'
        }, function (workerServer) {
            initFileZones();
        });
    });