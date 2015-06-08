line.module(function () {

    var ATTRIBUTE_PROPERTY = 1,
        ATTRIBUTE_TOGGLE = 2;

    var attrTypes = {
        'value': ATTRIBUTE_PROPERTY,
        'checked': ATTRIBUTE_TOGGLE,
        'selected': ATTRIBUTE_TOGGLE,
        'class': 'className',
        'for': 'htmlFor',
        'tabindex': 'tabIndex',
        'readonly': 'readOnly',
        'maxlength': 'maxLength',
        'cellspacing': 'cellSpacing',
        'cellpadding': 'cellPadding',
        'rowspan': 'rowSpan',
        'colspan': 'colSpan',
        'usemap': 'useMap',
        'frameborder': 'frameBorder',
        'contenteditable': 'contentEditable'
    };

    var STYLE_NUMBER = 1;

    var styleTypes = {
        'float': 'cssFloat',
        'columnCount': STYLE_NUMBER,
        'columns': STYLE_NUMBER,
        'fontWeight': STYLE_NUMBER,
        'lineHeight': STYLE_NUMBER,
        'opacity': STYLE_NUMBER,
        'order': STYLE_NUMBER,
        'orphans': STYLE_NUMBER,
        'widows': STYLE_NUMBER,
        'zIndex': STYLE_NUMBER,
        'zoom': STYLE_NUMBER
    };

    // Event types according to http://www.w3.org/TR/DOM-Level-3-Events
    var eventTypes = {
        // UIEvent
        load: 'UIEvent',
        unload: 'UIEvent',
        abort: 'UIEvent',
        error: 'UIEvent',
        select: 'UIEvent',
        resize: 'UIEvent',
        scroll: 'UIEvent',

        // FocusEvent
        blur: 'FocusEvent',
        focus: 'FocusEvent',
        focusin: 'FocusEvent',
        focusout: 'FoucsEvent',

        // MouseEvent
        click: 'MouseEvent',
        dblclick: 'MouseEvent',
        mousedown: 'MouseEvent',
        mouseenter: 'MouseEvent',
        mouseleave: 'MouseEvent',
        mousemove: 'MouseEvent',
        mouseout: 'MouseEvent',
        mouseover: 'MouseEvent',
        mouseup: 'MouseEvent',

        // WheelEvent
        wheel: 'WheelEvent',

        // InputEvent, but most browsers use Event instead
        beforeinput: 'Event',
        input: 'Event',

        // KeyboardEvent
        keydown: 'KeyboardEvent',
        keyup: 'KeyboardEvent',

        // CompositionEvent
        compositionstart: 'CompositionEvent',
        compositionupdate: 'CompositionEvent',
        compositionend: 'CompositionEvent'
    };

    return line.define('DOMUtil', {
        static: true,
        partial: true,
        methods: {
            createElement: function (tag) {
                return document.createElement(tag);
            },
            createTextNode: function (text) {
                return document.createTextNode(text || '');
            },
            getText: function (dom) {
                if (dom) {
                    if (dom.nodeType === 3) {
                        return dom.nodeValue;
                    }
                    else {
                        return dom.textContent;
                    }
                }
            },
            setText: function (dom, text) {
                if (dom) {
                    if (dom.nodeType === 3) {
                        dom.nodeValue = text || '';
                    }
                    else {
                        dom.textContent = text || '';
                    }
                }
            },
            getHtml: function (dom) {
                if (dom) {
                    return dom.innerHTML;
                }
            },
            setHtml: function (dom, html) {
                if (dom) {
                    dom.innerHTML = html === null ? '' : html;
                }
            },
            getAttribute: function (dom, name) {
                if (dom) {
                    var attrType = attrTypes[name];

                    if (attrType === ATTRIBUTE_PROPERTY || attrType === ATTRIBUTE_TOGGLE) {
                        return dom[name];
                    }
                    else if (attrType) {
                        return dom[attrType];
                    }
                    else {
                        return dom.getAttribute(name);
                    }
                }
            },
            setAttribute: function (dom, name, value) {
                if (dom) {
                    var attrType = attrTypes[name];

                    if (attrType === ATTRIBUTE_PROPERTY) {
                        dom[name] = value;
                        dom.setAttribute(name, value);
                    }
                    else if (attrType === ATTRIBUTE_TOGGLE) {
                        dom[name] = value;
                        if (value) {
                            dom.setAttribute(name, name);
                        }
                        else {
                            dom.removeAttribute(name);
                        }
                    }
                    else if (attrType) {
                        dom[attrType] = value;
                        dom.setAttribute(name, value);
                    }
                    else {
                        dom.setAttribute(name, value);
                    }
                }
            },
            getStyle: function (dom, name, computed) {
                if (dom) {
                    var style = computed ? getComputedStyle(dom, null) : dom.style;
                    var styleType = styleTypes[name];

                    if (typeof styleType == 'string') {
                        return style[styleType];
                    }
                    else {
                        return style[name];
                    }
                }
            },
            setStyle: function (dom, name, value) {
                if (dom) {
                    var styleType = styleTypes[name];

                    if (typeof styleType == 'string') {
                        dom.style[styleType] = value;
                    }
                    else if (styleType === STYLE_NUMBER || typeof value !== 'number') {
                        dom.style[name] = value;
                    }
                    else {
                        dom.style[name] = value + 'px';
                    }
                }
            },
            removeStyle: function (dom, name) {
                if (dom) {
                    dom.style.removeProperty(name);
                }
            },
            parent: function (node) {
                if (node) {
                    return node.parentNode;
                }
                else {
                    return null;
                }
            },
            prepend: function (parent, child) {
                if (parent && child) {
                    var first = parent.firstChild;
                    if (first) {
                        parent.insertBefore(child, first);
                    }
                    else {
                        parent.appendChild(child);
                    }
                }
            },
            append: function (parent, child) {
                if (parent && child) {
                    parent.appendChild(child);
                }
            },
            before: function (node, ref) {
                if (node && ref) {
                    var parent = ref.parentNode;
                    if (parent) {
                        parent.insertBefore(node, ref);
                    }
                }
            },
            after: function (node, ref) {
                if (node && ref) {
                    var parent = ref.parentNode;
                    if (parent) {
                        var next = ref.nextSibling;
                        if (next) {
                            parent.insertBefore(node, next);
                        }
                        else {
                            parent.appendChild(node);
                        }
                    }
                }
            },
            replace: function (oldNode, newNode) {
                if (oldNode && newNode) {
                    oldNode.parentNode.replaceChild(newNode, oldNode);
                }
            },
            remove: function (node) {
                if (node) {
                    var parent = node.parentNode;
                    if (parent) {
                        parent.removeChild(node);
                    }
                }
            },
            addEventListener: function (dom, name, handler, capture) {
                if (dom) {
                    dom.addEventListener(name, handler, capture);
                }
            },
            removeEventListener: function (dom, name, handler) {
                if (dom) {
                    dom.removeEventListener(name, handler);
                }
            },
            dispatchEvent: function (dom, name, options) {
                if (dom && name) {
                    var eventType = eventTypes[name];
                    var event = document.createEvent(eventType || 'CustomEvent');
                    var init = event['init' + eventType];
                    var settings = line.extend({
                        bubbles: true,
                        cancelable: true,
                        detail: null
                    }, options);

                    if (eventType) {
                        event.initEvent(name, settings.bubbles, settings.cancelable);
                    }
                    else {
                        event.initCustomEvent(name, settings.bubbles, settings.cancelable, settings.detail);
                    }

                    dom.dispatchEvent(event);
                }
            },
            camelize: function (str) {
                return str.replace(/-+(.)?/g, function (match, chr) {
                    return chr ? chr.toUpperCase() : '';
                });
            },
            dasherize: function (str) {
                return str.replace(/::/g, '/')
                    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
                    .replace(/([a-z\d])([A-Z])/g, '$1_$2')
                    .replace(/_/g, '-')
                    .toLowerCase();
            }
        }
    });

});