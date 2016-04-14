function FilterMe(){


    /******************************************
     * Application properties
     *****************************************/

    /**
     * Instance of this object
     *
     * @type object
     */
    var app = {};


    /**
     * Application current version
     *
     * @type string
     */
    var version = '0.1';

    /**
     * Defines a select type
     *
     * @type {string}
     */
    var SELECT_TYPE = 'select';

    /**
     * Defines a custom type
     *
     * @type {string}
     */
    var CUSTOM_TYPE = 'custom';


    var allowed_filter_types = [
        SELECT_TYPE,
        CUSTOM_TYPE
    ]

    /**
     * Defines allowed configuration variables
     *
     * @type {string[]}
     */
    var allowed_config_var = [
        'selector',             // describes an element which contains a data to filter
        'data_type',            // type of element to filter
        'filter_selector',      // filter txt selector,
        'custom_callback'       // Allow users to specify custom callback for handling filtering
                                // when data_type is set to custom, then custom_callback is required!!!
    ];

    /**
     * Object configuration
     * @type {{}}
     */
    app.config = {};

    /**
     * Class used to find out if this app should be used
     * @type {string}
     */
    var defaultSelectorClass = '.filterMePlease';

    /**
     * Filter element prefix - used to define an unique id for
     * this app filter searcher field
     *
     * @type {string}
     */
    var filterElementPrefix = 'filterMeSearcher';

    /************************************************
     * Application methods
     ***********************************************/

    /**
     * Get application version
     *
     * @returns {string}
     */
    app.getVersion = function(){
        return version;
    };

    /**
     * Checks if page contains any filter me elements
     *
     * @returns {boolean}
     */
    app.containsFilterMeElements = function(){
        return $(app.getSelector()).length;
    };

    /**
     * Get Id's of filter Me elements
     *
     * @returns {Array} A list with element names
     */
    app.getFilterMeIdElementsList = function(){
        var idList = [];
        if(!app.containsFilterMeElements())
            return idList;

        $.each($(app.getSelector()), function(index,element){
            //idList.push(element.id);
            idList.push(app.fixSelectorId(element));
        });
        return idList;
    };

    /**
     * If element does not have an id defined then automatic
     * id is created
     *
     * @param element
     * @return {string} Element id
     */
    app.fixSelectorId = function(element){
        var newElementId = element.id;
        if(!app.hasId(element)){
            newElementId = app.createElementUniqueId(element);
        }

        return newElementId;
    };

    /**
     * Creates a new id
     *
     * @param element
     */
    app.createElementUniqueId = function(element){
        var newId = 'id'+(new Date()).getTime();
        element.id = newId;

        return newId;
    };


    /**
     * Checks if element has Id attribute defined
     * @param element
     * @returns {boolean}
     */
    app.hasId = function(element){
        return element.id.length;
    };

    /**
     * Creates filter search fields
     */
    app.createFilterSearchField = function(){
        if(!app.containsFilterMeElements()){
            return; // not need for filter me elements
        }

        var idList = app.getFilterMeIdElementsList();

        if(!idList.length){
            return; // no elements included
        }

        $.each(idList,function(index,id){
            if(!app.hasFindMeElementRendered(id) && id.length)
                app.renderFilterMeElement(id);
        });


    };

    /**
     * Checks if element is already existing (rendered)
     *
     * @param id
     * @returns {*}
     */
    app.hasFindMeElementRendered = function(id){
        if(!app.hasFilterSelector()){
            //console.log('does not exists',id);
            return $("#" +app.makeUniqueSearcherFieldId(id)).length;

        }
        return $(app.getFilterSelector()).length;
    };


    /**
     * Set a filter selector
     *
     * @param filterSelector
     */
    app.setFilterSelector = function(filterSelector){
        app.config["filter_selector"] = filterSelector;
    };

    /**
     * Get filter selector
     *
     * @return {*}
     */
    app.getFilterSelector = function(){
        return app.config["filter_selector"];
    };

    /**
     * Get default filter selector
     *
     * @return {string}
     */
    app.getDefaultFilterSelector = function(){
        return '.'+filterElementPrefix;
    };

    /**
     * Render filter me element
     *
     * @param id    Element id
     */
    app.renderFilterMeElement = function(id){
        var element = $("#"+id);
        if(!element.length){
            throw "Element has not been found!!! for id: "+id;
        }
        var filterMeElementId = app.makeUniqueSearcherFieldId(id);
        element.before('<input type="text" id="'+filterMeElementId+'"  class="form-control '+filterElementPrefix+'" placeholder="..." >');
    };

    /**
     * Filter options by txt
     */
    app.filterOptionsByTxt = function(){
        if(!app.hasFilterSelector())
            app.setFilterSelector(app.getDefaultFilterSelector());

        $(app.getFilterSelector()).on('keypress change keyup keydown ', function(e){
            var filterTxt = $(this).val();

            var selector = '';
            if(!app.hasSelector() || app.getSelector() === defaultSelectorClass){
                // use dynamic selectors
                var id = app.getElementIdFromUniqueSearchFieldId($(this).attr('id'));

                selector =  "#"+id;
            }else{
                selector = app.getSelector();
            }
            if(!app.isSelectorRendered(selector)){
                return;
            }

            app.run(selector,filterTxt);
        })
    };

    /**
     * Checks if selector is rendered
     *
     * @param selector
     * @return {*}
     */
    app.isSelectorRendered = function(selector){
        return $(selector).length;
    };

    /**
     * Run filter data
     * @param selector
     * @param filter_txt
     */
    app.run = function(selector,filter_txt){
        var type = app.getDataType();
        switch (type){
            case SELECT_TYPE:
                return app.filterSelectData(selector,filter_txt);
            case CUSTOM_TYPE:
                return app.filterCustomCallbackData(selector,filter_txt,app.getCustomCallback());
            default:
                throw new Error("Unknown type!!! Filter cannot execute!");
        }
    };

    /**
     * Filter data by custom callback method
     * @param selector
     * @param filter_txt
     * @param callback
     * @return {*}
     */
    app.filterCustomCallbackData = function(selector, filter_txt, callback){
        if(!app.isCallback(callback))
            throw new Error("Callback method is required, to work properly with custom data types.");

        return callback(selector,filter_txt);
    };

    /**
     * Filter data from select HTML element
     *
     * @param selector
     * @param filter_txt
     */
    app.filterSelectData = function(selector,filter_txt){
        if(filter_txt.length){
            $(selector + ' option:not(:contains("'+filter_txt+'"))').hide();
            $(selector + ' option:contains("'+filter_txt+'")').show();
        }else{
            $(selector + ' option').show();
        }
    };

    /**
     * Set data type
     *
     * @param type
     */
    app.setDataType = function(type){
        if(!$.inArray(type,allowed_filter_types))
            return;
        app.config["data_type"] = type;
    };

    /**
     * Get element data type
     *
     * @return {*}
     */
    app.getDataType = function(){
        return app.config["data_type"];
    };

    /**
     * Set selector
     *
     * @param selector
     */
    app.setSelector = function(selector){
        app.config["selector"] = selector;
    };

    /**
     * Get selector
     *
     * @return {string}
     */
    app.getSelector = function(){
        return app.config["selector"];
    };

    /**
     * Checks if selector is defiend
     *
     * @return {boolean}
     */
    app.hasSelector = function(){
        return app.config["selector"] !== null;
    };

    app.getElementIdFromUniqueSearchFieldId = function(uniqueId){
        return uniqueId.replace(filterElementPrefix,'');
    };

    /**
     * Make unique searcher field id
     *
     * @param id
     * @returns {string}
     */
    app.makeUniqueSearcherFieldId = function(id){
        return filterElementPrefix+id;
    };

    /**
     * Set configuration
     *
     * @param configuration
     */
    app.setConfiguration = function(configuration){
        var tempConfig = typeof configuration !== 'undefined' ? configuration : app.getDefaultConfiguration();

        this.config = app.populateConfiguration(tempConfig);
    };


    /**
     * Populate configuration
     *
     * @param configuration
     * @return {*}
     */
    app.populateConfiguration = function(configuration){
        var defaultConfig = app.getDefaultConfiguration();
        if(configuration["selector"] === undefined){
            configuration["selector"] = defaultConfig["selector"];
        }

        if(configuration["data_type"] === undefined){
            configuration["data_type"] = defaultConfig["data_type"];
        }

        if(configuration["filter_selector"] === undefined){
            configuration["filter_selector"] = defaultConfig["filter_selector"];
        }

        if(configuration["custom_callback"] === undefined){
            configuration["custom_callback"] = defaultConfig["custom_callback"];
        }

        configuration = app.sanitizeConfiguration(configuration);
        return configuration;
    };

    /**
     * Removes not allowed properties from configuration
     *
     * @param configuration
     */
    app.sanitizeConfiguration = function(configuration){
        $.each(configuration, function(index,value){
            if($.inArray(index,allowed_config_var) === -1)
                delete configuration[index];
        });
        return configuration;
    };

    /**
     * Check if
     * @param callback
     * @return {boolean}
     */
    app.hasCustomCallback = function(){
        return app.isCallback(app.getCustomCallback());
    };


    app.isCallback = function(callback){
        if(callback && typeof callback == "function"){
            return true;
        }
        return false;
    };

    app.getCustomCallback = function(){
        return app.config["custom_callback"];
    };

    app.setCustomCallback = function(callback){
        if(!app.isCallback(callback))
            throw new Error("Custom callback cannot be set not valid param: "+ callback);

        app.config["custom_callback"] = callback;
    };

    /**
     * Checks if filter selector has been defined
     *
     * @return {boolean}
     */
    app.hasFilterSelector = function(){
        return app.config["filter_selector"] !== null;
    };

    /**
     * Get a default find Me configuration
     *
     * @returns {{obj}}
     */
    app.getDefaultConfiguration = function(){
        return {
            'selector': defaultSelectorClass,
            'data_type': SELECT_TYPE,
            'filter_selector': null,
            'custom_callback': null
        };
    };

    /**
     * Init plugin
     *
     * @param config
     */
    app.init = function(configuration){
        app.setConfiguration(configuration);
        app.main();
        // console.log('config',app.config);
    };

    /**
     * Reset settings
     */
    app.reset = function(){
        app.config = {};
    };

    /**
     * The main method
     */
    app.main = function(){
        app.createFilterSearchField();
        app.filterOptionsByTxt();
    };


    /***********************************
     * Public method/property exposure
     **********************************/
    //Example on how only a few methods could be exposed
    return {
        main: app.main,
        init: app.init,
        version: app.getVersion
    };

};


$(document).ready(function()
{
    FilterMe().init();
});