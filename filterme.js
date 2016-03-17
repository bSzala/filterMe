var FilterMe = (function($){


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
     * Class used to find out if this app should be used
     * @type {string}
     */
    var filterSearchFieldClass = '.filterMePlease';

    /**
     * Filter element id prefix - used to define an unique id for
     * this app filter searcher field
     *
     * @type {string}
     */
    var filterElementIdPrefix = 'filterMeSearcher';

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
        return $(filterSearchFieldClass).length;
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

        $.each($(filterSearchFieldClass), function(index,element){
            idList.push(element.id);
        });
        console.log('my filtered list',idList);
        return idList;
    };

    /**
     * Creates filter search fields
     */
    app.createFilterSearchField = function(){
            if(!app.containsFilterMeElements())
                return; // not need for filter me elements
            console.log(
                'Yes Pleas use me!!!'
            );
        var idList = app.getFilterMeIdElementsList();

        if(!idList.length)
            return; // no elements included

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
        return $("#" +app.makeUniqueSearcherFieldId(id)).length;
    };

    /**
     * Render filter me element
     *
     * @param id    Element id
     */
    app.renderFilterMeElement = function(id){
        var element = $("#"+id);
        if(!element.length){
            console.log('my missing id is:',id);
            throw "Element has not been found!!! for id: "+id;
        }
        var uniqueId = app.makeUniqueSearcherFieldId(id);
        element.before('<input type="text" id="'+uniqueId+'"  class="form-control '+filterElementIdPrefix+'" placeholder="..." >');
    };

    /**
     * Filter options by txt
     */
    app.filterOptionsByTxt = function(){
        $('.'+filterElementIdPrefix).on('keypress change keyup keydown ', function(e){
            var filterTxt = $(this).val();
            console.log($(this).attr('id'));
            var id = app.getElementIdFromUniqueSearchFieldId($(this).attr('id'));
            var elementId = "#"+id;
            if(filterTxt.length){
                $(elementId + ' option:not(:contains("'+filterTxt+'"))').hide();
                $(elementId + ' option:contains("'+filterTxt+'")').show();
            }else{
                $(elementId + ' option').show();
            }
        })
    };

    app.getElementIdFromUniqueSearchFieldId = function(uniqueId){
          return uniqueId.replace(filterElementIdPrefix,'');
    };

    /**
     * Make unique searcher field id
     *
     * @param id
     * @returns {string}
     */
    app.makeUniqueSearcherFieldId = function(id){
        return filterElementIdPrefix+id;
    };

    app.checkFindMeElementsAfterAjaxRequest = function(){
        $(document).ajaxComplete(function() {
            app.main();
        });
    };

    /**
     * The main method
     */
    app.main = function(){
        app.createFilterSearchField();
        app.filterOptionsByTxt();
        app.checkFindMeElementsAfterAjaxRequest();
    };


    /***********************************
     * Public method/property exposure
     **********************************/
    //Example on how only a few methods could be exposed
    return {
        main: app.main,
        checkFindMeElementsAfterAjaxRequest: app.checkFindMeElementsAfterAjaxRequest,
        version: app.getVersion
    };

})(jQuery);


$(document).ready(function()
{
    FilterMe.main();
});