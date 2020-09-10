# Live Edit 

> ## 🛈 Notice
> Live Edit is still in Development, bugs included 

- Added (resources/assets/translation-helper.js) JS in Template (requires jQuery)
- Added TranslationPrefix to Translator output
    Extend Laravel default Translation Provider and Translator and overwrite Tarnslator->get() Method to add prefix


```
class ExtendedTranslator extends Translator
{

    public function get($key, array $replace = [], $locale = null, $fallback = true)
    {
        if(Session::get('translate.live',false)){
            $parts = explode('.',$key);
            $group = array_shift($parts);
            if($translation = Translation::where([
                'locale' => !$locale ? app()->getLocale() : $locale,
                'key' => implode('.',$parts),
                'group' => $group
            ])->first()){
                $value = $translation->value;
            }else{
                $value = parent::get($key, $replace, $locale, $fallback);
            }

            if(is_string($value))
                return "{trans:$key}".$value;
        }

        return parent::get($key, $replace, $locale, $fallback);
    }
}

```

Adding Script to your Template, Define your Condition for Include

```
@if(config('app.debug'))
    <script src="/path/to/translation-helper.js"></script>
@endif
```

Use modal for Live-Edit (Bootstrap requried), or Replace Modal with other alternatives :)

```
<!-- inline translation modal !-->
<div class="modal fade" tabindex="-1" role="dialog" id="inline-translation">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Edit Translation</h4>
            </div>
            <div class="modal-body">
                <textarea class="form-control translation-content-edit" rows="3" data-token="{{csrf_token()}}"></textarea>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary save">Save changes</button>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div><!-- /.modal -->
<!-- inline translation modal end !-->
```
