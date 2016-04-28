# filterMe
Useful jquery library for filtering elements within a page. By default works without configuration with all select HTML elements where ".filterMePlease" selector is used (see basic demo example).

Of course, You can override all settings by triggering init method with your own params. 

## Dependencies 

Requires only to have jquery library already loaded


## How to use it

1.  Include jquery plugin 
```
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
```
2.  Include filterme.js file
```
<script src="filterme.js"></script>
```
3.  Load filterMe plugin 
```
<script>
  $(function(){
       FilterMe().init();
  });
</script>
```
4.  Add class => *filterMePlease* to "select" element where You would like to have a filter feature
```
<select class="filterMePlease">
...
</select>
```

