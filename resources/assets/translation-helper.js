
LANG_KEY_REGEX = /\{trans:([^\]]+)\}/;

function findAndReplace(searchText, replacement, searchNode) {
    if (!searchText || typeof replacement === 'undefined') {
        // Throw error here if you want...
        return;
    }
    var regex = typeof searchText === 'string' ?
        new RegExp(searchText, 'g') : searchText,
        childNodes = (searchNode || document.body).childNodes,
        cnLength = childNodes.length,
        excludes = 'html,head,style,title,link,meta,script,object,iframe'.split(',');
    while (cnLength--) {
        var currentNode = childNodes[cnLength];

        if(currentNode === window.dummy_element)
            debugger;

        if (currentNode.nodeType === 1 &&
            excludes.indexOf(currentNode.nodeName.toLowerCase()) === -1) {
            arguments.callee(searchText, replacement, currentNode);
        }
        if (currentNode.nodeType !== 3 || !regex.test(currentNode.data) ) {
            continue;
        }
        var parent = currentNode.parentNode,
            frag = (function(){
                var html = currentNode.data.replace(regex, replacement),
                    wrap = document.createElement('div'),
                    frag = document.createDocumentFragment();
                wrap.innerHTML = html;
                while (wrap.firstChild) {
                    frag.appendChild(wrap.firstChild);
                }
                return frag;
            })();
        parent.insertBefore(frag, currentNode);
        parent.removeChild(currentNode);
    }
}

findAndReplace(LANG_KEY_REGEX,function () {
    return "<span class='translation translation-inline-helper'>$key</span>".replace('$key',arguments[1]);
});

$(function () {

    $('.translation').each(function ($item) {
        var $elem = $(this);
        $elem.parent().addClass('translation-content');
        $elem.on('click',function (e) {
            $modal = $('#inline-translation');
            path = $elem.text();
            group = path.split('.')[0];
            key = path.split('.')[1];
            $.getJSON('/translations/edit/'+group+'/'+key,function (response) {
                if(response){
                    var $textarea = $modal.find('.translation-content-edit');
                    $textarea.data(response);
                    if(response.value)
                        $textarea.val(response.value);
                    else
                        $textarea.val("");
                }
            });
            $modal.on('shown.bs.modal', function () {
                $('#inline-translation').focus()
            }).modal('show');

            e.preventDefault();
            return false;
        })
        //$key = $elem.innerText;
        //$group = $key.split('.').shift();

    });

    $('#inline-translation .save').on('click',function () {
        $content = $('#inline-translation .translation-content-edit');
        data = {
            name: $content.data('locale')+"|"+$content.data('key'),
            pk: $content.data('id'),
            value : $('#inline-translation .translation-content-edit').val(),
            '_token': $content.data('token')
        };

        $.post('/translations/edit/'+$content.data('group'),data,function (response) {
            toastr["success"]("Translation saved successfully");
            $('#inline-translation').modal('hide');
        })

    });


});
