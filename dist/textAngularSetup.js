var taTools = {};

angular.module('textAngularSetup', [])
  .constant('taRegisterTool', function(name, toolDefinition) {
    taTools[name] = toolDefinition;
  })
  .value('taTools', taTools)
  .value('taOptions', {
    forceTextAngularSanitize: true,
    keyMappings: [],
    toolbar: [
      ["h1", "h2", "h3", "p", "quote", "bold", "italics", "underline", "strikeThrough", "ul", "ol", "clear", "justifyLeft", "justifyCenter", "justifyRight", "insertImage", "insertLink", "insertVideo"]
    ],
    classes: {
      focussed: "focussed",
      toolbar: "btn-toolbar",
      toolbarGroup: "btn-group",
      toolbarButton: "btn btn-default",
      toolbarButtonActive: "active",
      disabled: "disabled",
      textEditor: 'form-control',
      htmlEditor: 'form-control'
    },
    defaultTagAttributes: {
      a: { target: "" }
    },
    setup: {
      textEditorSetup: function($element) { /* Do some processing here */ },
      htmlEditorSetup: function($element) { /* Do some processing here */ }
    },
    defaultFileDropHandler: function(file, insertAction) {
      var reader = new FileReader();
      if (file.type.substring(0, 5) === 'image') {
        reader.onload = function() {
          if (reader.result !== '') insertAction('insertImage', reader.result, true);
        };
        reader.readAsDataURL(file);
        return true;
      }
      return false;
    }
  })

.value('taSelectableElements', ['a', 'img', 'variable'])

.value('taCustomRenderers', [{
  // Parse back out: '<div class="ta-insert-video" ta-insert-video src="' + urlLink + '" allowfullscreen="true" width="300" frameborder="0" height="250"></div>'
  // To correct video element. For now only support youtube
  selector: 'img',
  customAttribute: 'ta-insert-video',
  renderLogic: function(element) {
    var iframe = angular.element('<iframe></iframe>');
    var attributes = element.prop("attributes");
    // loop through element attributes and apply them on iframe
    angular.forEach(attributes, function(attr) {
      iframe.attr(attr.name, attr.value);
    });
    iframe.attr('src', iframe.attr('ta-insert-video'));
    element.replaceWith(iframe);
  }
}])

.value('taTranslations', {
  html: { tooltip: 'Toggle html / Rich Text' },
  heading: { tooltip: 'Heading ' },
  p: { tooltip: 'Paragraph' },
  pre: { tooltip: 'Preformatted text' },
  ul: { tooltip: 'Unordered List' },
  ol: { tooltip: 'Ordered List' },
  quote: { tooltip: 'Quote/unquote selection or paragraph' },
  undo: { tooltip: 'Undo' },
  redo: { tooltip: 'Redo' },
  bold: { tooltip: 'Bold' },
  italic: { tooltip: 'Italic' },
  underline: { tooltip: 'Underline' },
  strikeThrough: { tooltip: 'Strikethrough' },
  justifyLeft: { tooltip: 'Align text left' },
  justifyRight: { tooltip: 'Align text right' },
  justifyFull: { tooltip: 'Justify text' },
  justifyCenter: { tooltip: 'Center' },
  indent: { tooltip: 'Increase indent' },
  outdent: { tooltip: 'Decrease indent' },
  clear: { tooltip: 'Clear formatting' },
  insertImage: { tooltip: 'Insert image', dialogPrompt: 'Please enter an image URL to insert', hotkey: 'the - possibly language dependent hotkey ... for some future implementation' },
  insertVideo: { tooltip: 'Insert video', dialogPrompt: 'Please enter a youtube URL to embed' },
  insertLink: { tooltip: 'Insert / edit link', dialogPrompt: "Please enter a URL to insert" },
  editLink: {
    reLinkButton: { tooltip: "Relink" },
    unLinkButton: { tooltip: "Unlink" },
    targetToggle: { buttontext: "Open in New Window" }
  }
})

.factory('taToolFunctions', ['$window', 'taTranslations', function($window, taTranslations) {
  return {
    imgOnSelectAction: function(event, $element, editorScope) {
      // setup the editor toolbar
      // Credit to the work at http://hackerwins.github.io/summernote/ for this editbar logic/display
      var finishEdit = function() {
        editorScope.updateTaBindtaTextElement();
        editorScope.hidePopover();
      };
      event.preventDefault();
      editorScope.displayElements.popover.css('width', '375px');
      var container = editorScope.displayElements.popoverContainer;
      container.empty();
      var buttonGroup = angular.element('<div class="btn-group" style="padding-right: 6px;">');
      var fullButton = angular.element('<button type="button" class="btn btn-default btn-sm btn-small" unselectable="on" tabindex="-1">100% </button>');
      fullButton.on('click', function(event) {
        event.preventDefault();
        $element.css({
          'width': '100%',
          'height': ''
        });
        finishEdit();
      });
      var halfButton = angular.element('<button type="button" class="btn btn-default btn-sm btn-small" unselectable="on" tabindex="-1">50% </button>');
      halfButton.on('click', function(event) {
        event.preventDefault();
        $element.css({
          'width': '50%',
          'height': ''
        });
        finishEdit();
      });
      var quartButton = angular.element('<button type="button" class="btn btn-default btn-sm btn-small" unselectable="on" tabindex="-1">25% </button>');
      quartButton.on('click', function(event) {
        event.preventDefault();
        $element.css({
          'width': '25%',
          'height': ''
        });
        finishEdit();
      });
      var resetButton = angular.element('<button type="button" class="btn btn-default btn-sm btn-small" unselectable="on" tabindex="-1">Reset</button>');
      resetButton.on('click', function(event) {
        event.preventDefault();
        $element.css({
          width: '',
          height: ''
        });
        finishEdit();
      });
      buttonGroup.append(fullButton);
      buttonGroup.append(halfButton);
      buttonGroup.append(quartButton);
      buttonGroup.append(resetButton);
      container.append(buttonGroup);

      buttonGroup = angular.element('<div class="btn-group" style="padding-right: 6px;">');
      var floatLeft = angular.element('<button type="button" class="btn btn-default btn-sm btn-small" unselectable="on" tabindex="-1"><i class="fa fa-align-left"></i></button>');
      floatLeft.on('click', function(event) {
        event.preventDefault();
        // webkit
        $element.css('float', 'left');
        // firefox
        $element.css('cssFloat', 'left');
        // IE < 8
        $element.css('styleFloat', 'left');
        finishEdit();
      });
      var floatRight = angular.element('<button type="button" class="btn btn-default btn-sm btn-small" unselectable="on" tabindex="-1"><i class="fa fa-align-right"></i></button>');
      floatRight.on('click', function(event) {
        event.preventDefault();
        // webkit
        $element.css('float', 'right');
        // firefox
        $element.css('cssFloat', 'right');
        // IE < 8
        $element.css('styleFloat', 'right');
        finishEdit();
      });
      var floatNone = angular.element('<button type="button" class="btn btn-default btn-sm btn-small" unselectable="on" tabindex="-1"><i class="fa fa-align-justify"></i></button>');
      floatNone.on('click', function(event) {
        event.preventDefault();
        // webkit
        $element.css('float', '');
        // firefox
        $element.css('cssFloat', '');
        // IE < 8
        $element.css('styleFloat', '');
        finishEdit();
      });
      buttonGroup.append(floatLeft);
      buttonGroup.append(floatNone);
      buttonGroup.append(floatRight);
      container.append(buttonGroup);

      buttonGroup = angular.element('<div class="btn-group">');
      var remove = angular.element('<button type="button" class="btn btn-default btn-sm btn-small" unselectable="on" tabindex="-1"><i class="fa fa-trash-o"></i></button>');
      remove.on('click', function(event) {
        event.preventDefault();
        $element.remove();
        finishEdit();
      });
      buttonGroup.append(remove);
      container.append(buttonGroup);

      editorScope.showPopover($element);
      editorScope.showResizeOverlay($element);
    },
    aOnSelectAction: function(event, $element, editorScope) {
      // setup the editor toolbar
      // Credit to the work at http://hackerwins.github.io/summernote/ for this editbar logic
      event.preventDefault();
      editorScope.displayElements.popover.css('width', '436px');
      var container = editorScope.displayElements.popoverContainer;
      container.empty();
      container.css('line-height', '28px');
      var link = angular.element('<a href="' + $element.attr('href') + '" target="_blank">' + $element.attr('href') + '</a>');
      link.css({
        'display': 'inline-block',
        'max-width': '200px',
        'overflow': 'hidden',
        'text-overflow': 'ellipsis',
        'white-space': 'nowrap',
        'vertical-align': 'middle'
      });
      container.append(link);
      var buttonGroup = angular.element('<div class="btn-group pull-right">');
      var reLinkButton = angular.element('<button type="button" class="btn btn-default btn-sm btn-small" tabindex="-1" unselectable="on" title="' + taTranslations.editLink.reLinkButton.tooltip + '"><i class="fa fa-edit icon-edit"></i></button>');
      reLinkButton.on('click', function(event) {
        event.preventDefault();
        var urlLink = $window.prompt(taTranslations.insertLink.dialogPrompt, $element.attr('href'));
        if (urlLink && urlLink !== '' && urlLink !== 'http://') {
          $element.attr('href', urlLink);
          editorScope.updateTaBindtaTextElement();
        }
        editorScope.hidePopover();
      });
      buttonGroup.append(reLinkButton);
      var unLinkButton = angular.element('<button type="button" class="btn btn-default btn-sm btn-small" tabindex="-1" unselectable="on" title="' + taTranslations.editLink.unLinkButton.tooltip + '"><i class="fa fa-unlink icon-unlink"></i></button>');
      // directly before this click event is fired a digest is fired off whereby the reference to $element is orphaned off
      unLinkButton.on('click', function(event) {
        event.preventDefault();
        $element.replaceWith($element.contents());
        editorScope.updateTaBindtaTextElement();
        editorScope.hidePopover();
      });
      buttonGroup.append(unLinkButton);
      var targetToggle = angular.element('<button type="button" class="btn btn-default btn-sm btn-small" tabindex="-1" unselectable="on">' + taTranslations.editLink.targetToggle.buttontext + '</button>');
      if ($element.attr('target') === '_blank') {
        targetToggle.addClass('active');
      }
      targetToggle.on('click', function(event) {
        event.preventDefault();
        $element.attr('target', ($element.attr('target') === '_blank') ? '' : '_blank');
        targetToggle.toggleClass('active');
        editorScope.updateTaBindtaTextElement();
      });
      buttonGroup.append(targetToggle);
      container.append(buttonGroup);
      editorScope.showPopover($element);
    },
    extractYoutubeVideoId: function(url) {
      var re = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i;
      var match = url.match(re);
      return (match && match[1]) || null;
    }
  };
}])

.run(['taRegisterTool', '$window', 'taTranslations', 'taSelection', 'taToolFunctions', '$sanitize', 'taOptions', '$log',
  function(taRegisterTool, $window, taTranslations, taSelection, taToolFunctions, $sanitize, taOptions, $log) {
    // test for the version of $sanitize that is in use
    // You can disable this check by setting taOptions.textAngularSanitize == false
    var gv = {};
    $sanitize('', gv);
    /* istanbul ignore next, throws error */
    if ((taOptions.forceTextAngularSanitize === true) && (gv.version !== 'taSanitize')) {
      throw angular.$$minErr('textAngular')("textAngularSetup", "The textAngular-sanitize provider has been replaced by another -- have you included angular-sanitize by mistake?");
    }
    taRegisterTool("html", {
      iconclass: 'fa fa-code',
      tooltiptext: taTranslations.html.tooltip,
      action: function() {
        this.$editor().switchView();
      },
      activeState: function() {
        return this.$editor().showHtml;
      }
    });
    // add the Header tools
    // convenience functions so that the loop works correctly
    var _retActiveStateFunction = function(q) {
      return function() {
        return this.$editor().queryFormatBlockState(q);
      };
    };
    var headerAction = function() {
      return this.$editor().wrapSelection("formatBlock", "<" + this.name.toUpperCase() + ">");
    };
    angular.forEach(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'], function(h) {
      taRegisterTool(h.toLowerCase(), {
        buttontext: h.toUpperCase(),
        tooltiptext: taTranslations.heading.tooltip + h.charAt(1),
        action: headerAction,
        activeState: _retActiveStateFunction(h.toLowerCase())
      });
    });
    taRegisterTool('p', {
      buttontext: 'P',
      tooltiptext: taTranslations.p.tooltip,
      action: function() {
        return this.$editor().wrapSelection("formatBlock", "<P>");
      },
      activeState: function() {
        return this.$editor().queryFormatBlockState('p');
      }
    });
    // key: pre -> taTranslations[key].tooltip, taTranslations[key].buttontext
    taRegisterTool('pre', {
      buttontext: 'pre',
      tooltiptext: taTranslations.pre.tooltip,
      action: function() {
        return this.$editor().wrapSelection("formatBlock", "<PRE>");
      },
      activeState: function() {
        return this.$editor().queryFormatBlockState('pre');
      }
    });
    taRegisterTool('ul', {
      iconclass: 'fa fa-list-ul',
      tooltiptext: taTranslations.ul.tooltip,
      action: function() {
        return this.$editor().wrapSelection("insertUnorderedList", null);
      },
      activeState: function() {
        return this.$editor().queryCommandState('insertUnorderedList');
      }
    });
    taRegisterTool('ol', {
      iconclass: 'fa fa-list-ol',
      tooltiptext: taTranslations.ol.tooltip,
      action: function() {
        return this.$editor().wrapSelection("insertOrderedList", null);
      },
      activeState: function() {
        return this.$editor().queryCommandState('insertOrderedList');
      }
    });
    taRegisterTool('quote', {
      iconclass: 'fa fa-quote-right',
      tooltiptext: taTranslations.quote.tooltip,
      action: function() {
        return this.$editor().wrapSelection("formatBlock", "<BLOCKQUOTE>");
      },
      activeState: function() {
        return this.$editor().queryFormatBlockState('blockquote');
      }
    });
    taRegisterTool('undo', {
      iconclass: 'fa fa-undo',
      tooltiptext: taTranslations.undo.tooltip,
      action: function() {
        return this.$editor().wrapSelection("undo", null);
      }
    });
    taRegisterTool('redo', {
      iconclass: 'fa fa-repeat',
      tooltiptext: taTranslations.redo.tooltip,
      action: function() {
        return this.$editor().wrapSelection("redo", null);
      }
    });
    taRegisterTool('bold', {
      iconclass: 'fa fa-bold',
      tooltiptext: taTranslations.bold.tooltip,
      action: function() {
        return this.$editor().wrapSelection("bold", null);
      },
      activeState: function() {
        return this.$editor().queryCommandState('bold');
      },
      commandKeyCode: 98
    });
    taRegisterTool('justifyLeft', {
      iconclass: 'fa fa-align-left',
      tooltiptext: taTranslations.justifyLeft.tooltip,
      action: function() {
        return this.$editor().wrapSelection("justifyLeft", null);
      },
      activeState: function(commonElement) {
        /* istanbul ignore next: */
        if (commonElement && commonElement.nodeName === '#document') return false;
        var result = false;
        if (commonElement) {
          // commonELement.css('text-align') can throw an error 'Cannot read property 'defaultView' of null' in rare conditions
          // so we do try catch here...
          try {
            result =
              commonElement.css('text-align') === 'left' ||
              commonElement.attr('align') === 'left' ||
              (
                commonElement.css('text-align') !== 'right' &&
                commonElement.css('text-align') !== 'center' &&
                commonElement.css('text-align') !== 'justify' && !this.$editor().queryCommandState('justifyRight') && !this.$editor().queryCommandState('justifyCenter')
              ) && !this.$editor().queryCommandState('justifyFull');
          } catch (e) {
            /* istanbul ignore next: error handler */
            //console.log(e);
            result = false;
          }
        }
        result = result || this.$editor().queryCommandState('justifyLeft');
        return result;
      }
    });
    taRegisterTool('justifyRight', {
      iconclass: 'fa fa-align-right',
      tooltiptext: taTranslations.justifyRight.tooltip,
      action: function() {
        return this.$editor().wrapSelection("justifyRight", null);
      },
      activeState: function(commonElement) {
        /* istanbul ignore next: */
        if (commonElement && commonElement.nodeName === '#document') return false;
        var result = false;
        if (commonElement) {
          // commonELement.css('text-align') can throw an error 'Cannot read property 'defaultView' of null' in rare conditions
          // so we do try catch here...
          try {
            result = commonElement.css('text-align') === 'right';
          } catch (e) {
            /* istanbul ignore next: error handler */
            //console.log(e);
            result = false;
          }
        }
        result = result || this.$editor().queryCommandState('justifyRight');
        return result;
      }
    });
    taRegisterTool('justifyFull', {
      iconclass: 'fa fa-align-justify',
      tooltiptext: taTranslations.justifyFull.tooltip,
      action: function() {
        return this.$editor().wrapSelection("justifyFull", null);
      },
      activeState: function(commonElement) {
        var result = false;
        if (commonElement) {
          // commonELement.css('text-align') can throw an error 'Cannot read property 'defaultView' of null' in rare conditions
          // so we do try catch here...
          try {
            result = commonElement.css('text-align') === 'justify';
          } catch (e) {
            /* istanbul ignore next: error handler */
            //console.log(e);
            result = false;
          }
        }
        result = result || this.$editor().queryCommandState('justifyFull');
        return result;
      }
    });
    taRegisterTool('justifyCenter', {
      iconclass: 'fa fa-align-center',
      tooltiptext: taTranslations.justifyCenter.tooltip,
      action: function() {
        return this.$editor().wrapSelection("justifyCenter", null);
      },
      activeState: function(commonElement) {
        /* istanbul ignore next: */
        if (commonElement && commonElement.nodeName === '#document') return false;
        var result = false;
        if (commonElement) {
          // commonELement.css('text-align') can throw an error 'Cannot read property 'defaultView' of null' in rare conditions
          // so we do try catch here...
          try {
            result = commonElement.css('text-align') === 'center';
          } catch (e) {
            /* istanbul ignore next: error handler */
            //console.log(e);
            result = false;
          }

        }
        result = result || this.$editor().queryCommandState('justifyCenter');
        return result;
      }
    });
    taRegisterTool('indent', {
      iconclass: 'fa fa-indent',
      tooltiptext: taTranslations.indent.tooltip,
      action: function() {
        return this.$editor().wrapSelection("indent", null);
      },
      activeState: function() {
        return this.$editor().queryFormatBlockState('blockquote');
      },
      commandKeyCode: 'TabKey'
    });
    taRegisterTool('outdent', {
      iconclass: 'fa fa-outdent',
      tooltiptext: taTranslations.outdent.tooltip,
      action: function() {
        return this.$editor().wrapSelection("outdent", null);
      },
      activeState: function() {
        return false;
      },
      commandKeyCode: 'ShiftTabKey'
    });
    taRegisterTool('italics', {
      iconclass: 'fa fa-italic',
      tooltiptext: taTranslations.italic.tooltip,
      action: function() {
        return this.$editor().wrapSelection("italic", null);
      },
      activeState: function() {
        return this.$editor().queryCommandState('italic');
      },
      commandKeyCode: 105
    });
    taRegisterTool('underline', {
      iconclass: 'fa fa-underline',
      tooltiptext: taTranslations.underline.tooltip,
      action: function() {
        return this.$editor().wrapSelection("underline", null);
      },
      activeState: function() {
        return this.$editor().queryCommandState('underline');
      },
      commandKeyCode: 117
    });
    taRegisterTool('strikeThrough', {
      iconclass: 'fa fa-strikethrough',
      tooltiptext: taTranslations.strikeThrough.tooltip,
      action: function() {
        return this.$editor().wrapSelection("strikeThrough", null);
      },
      activeState: function() {
        return document.queryCommandState('strikeThrough');
      }
    });
    taRegisterTool('clear', {
      iconclass: 'fa fa-ban',
      tooltiptext: taTranslations.clear.tooltip,
      action: function(deferred, restoreSelection) {
        var i, selectedElements, elementsSeen;

        this.$editor().wrapSelection("removeFormat", null);
        var possibleNodes = angular.element(taSelection.getSelectionElement());
        selectedElements = taSelection.getAllSelectedElements();
        //$log.log('selectedElements:', selectedElements);
        // remove lists
        var removeListElements = function(list, pe) {
          list = angular.element(list);
          var prevElement = pe;
          if (!pe) {
            prevElement = list;
          }
          angular.forEach(list.children(), function(liElem) {
            if (liElem.tagName.toLowerCase() === 'ul' ||
              liElem.tagName.toLowerCase() === 'ol') {
              prevElement = removeListElements(liElem, prevElement);
            } else {
              var newElem = angular.element('<p></p>');
              newElem.html(angular.element(liElem).html());
              prevElement.after(newElem);
              prevElement = newElem;
            }
          });
          list.remove();
          return prevElement;
        };

        angular.forEach(selectedElements, function(element) {
          if (element.nodeName.toLowerCase() === 'ul' ||
            element.nodeName.toLowerCase() === 'ol') {
            //console.log('removeListElements', element);
            removeListElements(element);
          }
        });

        angular.forEach(possibleNodes.find("ul"), removeListElements);
        angular.forEach(possibleNodes.find("ol"), removeListElements);

        // clear out all class attributes. These do not seem to be cleared via removeFormat
        var $editor = this.$editor();
        var recursiveRemoveClass = function(node) {
          node = angular.element(node);
          /* istanbul ignore next: this is not triggered in tests any longer since we now never select the whole displayELement */
          if (node[0] !== $editor.displayElements.text[0]) {
            node.removeAttr('class');
          }
          angular.forEach(node.children(), recursiveRemoveClass);
        };
        angular.forEach(possibleNodes, recursiveRemoveClass);
        // check if in list. If not in list then use formatBlock option
        if (possibleNodes[0] && possibleNodes[0].tagName.toLowerCase() !== 'li' &&
          possibleNodes[0].tagName.toLowerCase() !== 'ol' &&
          possibleNodes[0].tagName.toLowerCase() !== 'ul' &&
          possibleNodes[0].getAttribute("contenteditable") !== "true") {
          this.$editor().wrapSelection("formatBlock", "default");
        }
        restoreSelection();
      }
    });

    /* istanbul ignore next: if it's javascript don't worry - though probably should show some kind of error message */
    var blockJavascript = function(link) {
      if (link.toLowerCase().indexOf('javascript') !== -1) {
        return true;
      }
      return false;
    };

    taRegisterTool('insertImage', {
      iconclass: 'fa fa-picture-o',
      tooltiptext: taTranslations.insertImage.tooltip,
      action: function() {
        var imageLink;
        imageLink = $window.prompt(taTranslations.insertImage.dialogPrompt, 'http://');
        if (imageLink && imageLink !== '' && imageLink !== 'http://') {
          /* istanbul ignore next: don't know how to test this... since it needs a dialogPrompt */
          // block javascript here
          if (!blockJavascript(imageLink)) {
            if (taSelection.getSelectionElement().tagName && taSelection.getSelectionElement().tagName.toLowerCase() === 'a') {
              // due to differences in implementation between FireFox and Chrome, we must move the
              // insertion point past the <a> element, otherwise FireFox inserts inside the <a>
              // With this change, both FireFox and Chrome behave the same way!
              taSelection.setSelectionAfterElement(taSelection.getSelectionElement());
            }
            // In the past we used the simple statement:
            //return this.$editor().wrapSelection('insertImage', imageLink, true);
            //
            // However on Firefox only, when the content is empty this is a problem
            // See Issue #1201
            // Investigation reveals that Firefox only inserts a <p> only!!!!
            // So now we use insertHTML here and all is fine.
            // NOTE: this is what 'insertImage' is supposed to do anyway!
            var embed = '<img src="' + imageLink + '">';
            return this.$editor().wrapSelection('insertHTML', embed, true);
          }
        }
      },
      onElementSelect: {
        element: 'img',
        action: taToolFunctions.imgOnSelectAction
      }
    });
    taRegisterTool('insertVideo', {
      iconclass: 'fa fa-youtube-play',
      tooltiptext: taTranslations.insertVideo.tooltip,
      action: function() {
        var urlPrompt;
        urlPrompt = $window.prompt(taTranslations.insertVideo.dialogPrompt, 'https://');
        // block javascript here
        /* istanbul ignore else: if it's javascript don't worry - though probably should show some kind of error message */
        if (!blockJavascript(urlPrompt)) {

          if (urlPrompt && urlPrompt !== '' && urlPrompt !== 'https://') {

            videoId = taToolFunctions.extractYoutubeVideoId(urlPrompt);

            /* istanbul ignore else: if it's invalid don't worry - though probably should show some kind of error message */
            if (videoId) {
              // create the embed link
              var urlLink = "https://www.youtube.com/embed/" + videoId;
              // create the HTML
              // for all options see: http://stackoverflow.com/questions/2068344/how-do-i-get-a-youtube-video-thumbnail-from-the-youtube-api
              // maxresdefault.jpg seems to be undefined on some.
              var embed = '<img class="ta-insert-video" src="https://img.youtube.com/vi/' + videoId + '/hqdefault.jpg" ta-insert-video="' + urlLink + '" contenteditable="false" allowfullscreen="true" frameborder="0" />';
              /* istanbul ignore next: don't know how to test this... since it needs a dialogPrompt */
              if (taSelection.getSelectionElement().tagName && taSelection.getSelectionElement().tagName.toLowerCase() === 'a') {
                // due to differences in implementation between FireFox and Chrome, we must move the
                // insertion point past the <a> element, otherwise FireFox inserts inside the <a>
                // With this change, both FireFox and Chrome behave the same way!
                taSelection.setSelectionAfterElement(taSelection.getSelectionElement());
              }
              // insert
              return this.$editor().wrapSelection('insertHTML', embed, true);
            }
          }
        }
      },
      onElementSelect: {
        element: 'img',
        onlyWithAttrs: ['ta-insert-video'],
        action: taToolFunctions.imgOnSelectAction
      }
    });
    taRegisterTool('insertLink', {
      tooltiptext: taTranslations.insertLink.tooltip,
      iconclass: 'fa fa-link',
      action: function() {
        var urlLink;
        // if this link has already been set, we need to just edit the existing link
        /* istanbul ignore if: we do not test this */
        if (taSelection.getSelectionElement().tagName && taSelection.getSelectionElement().tagName.toLowerCase() === 'a') {
          urlLink = $window.prompt(taTranslations.insertLink.dialogPrompt, taSelection.getSelectionElement().href);
        } else {
          urlLink = $window.prompt(taTranslations.insertLink.dialogPrompt, 'http://');
        }
        if (urlLink && urlLink !== '' && urlLink !== 'http://') {
          // block javascript here
          /* istanbul ignore else: if it's javascript don't worry - though probably should show some kind of error message */
          if (!blockJavascript(urlLink)) {
            return this.$editor().wrapSelection('createLink', urlLink, true);
          }
        }
      },
      activeState: function(commonElement) {
        if (commonElement) return commonElement[0].tagName === 'A';
        return false;
      },
      onElementSelect: {
        element: 'a',
        action: taToolFunctions.aOnSelectAction
      }
    });
  }
]);
