( function( blocks, blockEditor, element, components ) {
    var __ = wp.i18n.__;
    var el = element.createElement;
    var RichText = blockEditor.RichText;
    var MediaUpload = blockEditor.MediaUpload;
    var CheckboxControl = components.CheckboxControl;
    var InspectorControls = blockEditor.InspectorControls;
    var PanelBody = components.PanelBody;
    var ColorPalette = components.ColorPalette;
    var TextControl = components.TextControl;
    var SelectControl = components.SelectControl;
    var useState = wp.element.useState;

    // registerBlockType
    blocks.registerBlockType( 'liquid/slider', {
        title: __('Carousel Slider', 'liquid-blocks'),
        icon: 'slides',
        category: 'liquid',
        attributes: {
            fields: {
                type: 'array',
                default: [{ 
                    text: '',
                    textAlignment: 'start',
                    textFontSize: 16,
                    textTextColor: '',
                    textBackgroundColor: '',
                    url: '',
                    openInNewTab: false,
                    image: '',
                    buttonText: '',
                    buttonAlignment: 'start',
                    buttonFontSize: 16,
                    buttonTextColor: '',
                    buttonBorderColor: '',
                }],
            },
            delay: {
                type: 'number',
                default: 3000,
            },
            slidesPerView: {
                type: 'number',
                default: 1.0,
            },
            animationType: {
                type: 'string',
                default: 'slide',
            },
            autoPlay: {
                type: 'boolean',
                default: true,
            },
            overlay: {
                type: 'boolean',
                default: true,
            },
        },
        supports: {
            align: ['wide', 'full']
        },
        example: {
            attributes: {
                fields: [
                    { 
                        text: 'Sample Text',
                        buttonText: 'Sample Button',
                        url: '',
                        openInNewTab: false,
                        image: '',
                        textTextColor: '#333333',
                        textBackgroundColor: '',
                        buttonTextColor: '#ffffff',
                        buttonBackgroundColor: '#333333',
                    }
                ],
                delay: 3000,
                slidesPerView: 1.0,
                animationType: 'slide',
            }
        },

        edit: function( props ) {
            var attributes = props.attributes;
            var setAttributes = props.setAttributes;
            var clientId = props.clientId;
            var magicNumber = 10/2;
            var showDuplicate = false;

            var [selectedFieldIndex, setSelectedFieldIndex] = useState(0);
            var [selectedFieldType, setSelectedFieldType] = useState('');
            var [selectedOption, setSelectedOption] = useState(0);

            function updateField( index, changes ) {
                var newFields = attributes.fields.slice();
                newFields[index] = Object.assign({}, newFields[index], changes);
                setAttributes({ fields: newFields });
            }

            function addFieldset() {
                if (attributes.fields.length < magicNumber) {
                    var newField = { 
                        text: '',
                        buttonText: '',
                        url: '',
                        openInNewTab: false,
                        image: ''
                    };
                    var newFields = attributes.fields.concat([newField]);
                    setAttributes({ fields: newFields });
                    setSelectedOption(newFields.length-1);
                }
            }

            function duplicateFieldset(index) {
                var fields = attributes.fields;
                if (fields.length < magicNumber) {
                    var fieldToDuplicate = Object.assign({}, fields[index]);
                    var newFields = fields.slice();
                    newFields.splice(index + 1, 0, fieldToDuplicate);
                    setAttributes({ fields: newFields });
                    setSelectedOption(index + 1);
                }
            }

            function removeFieldset(index) {
                var newFields = attributes.fields.slice();
                newFields.splice(index, 1);
                setAttributes({ fields: newFields });
                
                if (selectedOption === index) {
                    if (index > 0) {
                        // 直前のコンテンツを選択
                        setSelectedOption(index - 1);
                    } else if (newFields.length > 0) {
                        // 最初のコンテンツが削除された場合で、他にコンテンツが存在するなら、新しい最初のフィールドを選択
                        setSelectedOption(0);
                    } else {
                        // すべてのコンテンツが削除された場合
                        setSelectedOption(null);
                    }
                }
            }

            function moveFieldUp(index) {
                if (index === 0) return;
                const newFields = [...attributes.fields];
                [newFields[index - 1], newFields[index]] = [newFields[index], newFields[index - 1]];
                setAttributes({ fields: newFields });
                setSelectedOption(index - 1);
            }

            function moveFieldDown(index) {
                if (index === attributes.fields.length - 1) return;
                const newFields = [...attributes.fields];
                [newFields[index + 1], newFields[index]] = [newFields[index], newFields[index + 1]];
                setAttributes({ fields: newFields });
                setSelectedOption(index + 1);
            }

            function handleFieldSelect(index, type) {
                setSelectedFieldIndex(index);
                setSelectedFieldType(type);
            }

            function handleClick(index, event) {
                // 子要素からのイベントを無視
                if (event.target.closest('.ignoreClick')) {
                    event.stopPropagation();
                    return;
                }
                handleFieldSelect(index, '');
            }

            function handleRadioChange(event) {
                setSelectedOption(parseInt(event.target.value, 10));
            }

            function updateAlignment(index, type, alignment) {
                const newFields = [...attributes.fields];
                if (type === 'text') {
                    newFields[index].textAlignment = alignment;
                } else if (type === 'buttonText') {
                    newFields[index].buttonAlignment = alignment;
                }
                setAttributes({ fields: newFields });
            }

            return [
                // 条件によって BlockControls を表示
                selectedFieldType === 'text' && el(blockEditor.BlockControls, {},
                    el(blockEditor.AlignmentToolbar, {
                        value: attributes.fields[selectedFieldIndex].textAlignment,
                        onChange: (newAlignment) => updateAlignment(selectedFieldIndex, 'text', newAlignment)
                    })
                ),
                selectedFieldType === 'buttonText' && el(blockEditor.BlockControls, {},
                    el(blockEditor.AlignmentToolbar, {
                        value: attributes.fields[selectedFieldIndex].buttonAlignment,
                        onChange: (newAlignment) => updateAlignment(selectedFieldIndex, 'buttonText', newAlignment)
                    })
                ),
                el(InspectorControls, {},
                    el(PanelBody, { title: __('Slider Settings', 'liquid-blocks'), initialOpen: true },
                        (selectedFieldType !== 'buttonText' && selectedFieldType !== 'text') && el('div', {},
                            el(TextControl, {
                                label: __('Delay (millisecond)', 'liquid-blocks'),
                                value: attributes.delay,
                                onChange: (newVal) => setAttributes({ delay: parseInt(newVal, 10) })
                            }),
                            el(TextControl, {
                                label: __('Number of slides per view', 'liquid-blocks'),
                                value: attributes.slidesPerView.toString(),
                                onChange: (newVal) => setAttributes({ slidesPerView: parseFloat(newVal) })
                            }),
                            el(SelectControl, {
                                label: __('Effect', 'liquid-blocks'),
                                value: attributes.animationType,
                                options: [
                                    { label: __('Slide', 'liquid-blocks'), value: 'slide' },
                                    { label: __('Fade', 'liquid-blocks'), value: 'fade' }
                                ],
                                onChange: (newVal) => setAttributes({ animationType: newVal })
                            }),
                            el(CheckboxControl, {
                                label: __('Auto Play', 'liquid-blocks'),
                                checked: attributes.autoPlay,
                                onChange: (newVal) => setAttributes({ autoPlay: newVal }),
                            }),
                            el(CheckboxControl, {
                                label: __('Overlay', 'liquid-blocks'),
                                checked: attributes.overlay,
                                onChange: (newVal) => setAttributes({ overlay: newVal })
                            }),
                        ),
                        selectedFieldType === 'text' && el('div', {},
                            el('p', {}, __('Font Size', 'liquid-blocks')),
                            el(components.RangeControl, {
                                value: attributes.fields[selectedFieldIndex].textFontSize,
                                onChange: (newSize) => {
                                    let newFields = [...attributes.fields];
                                    newFields[selectedFieldIndex].textFontSize = newSize;
                                    setAttributes({ fields: newFields });
                                },
                                min: 8, max: 200, step: 1
                            }),
                            el('p', {}, __('Text Color', 'liquid-blocks')),
                            el(ColorPalette, {
                                value: attributes.fields[selectedFieldIndex].textTextColor,
                                onChange: (color) => {
                                    let fields = [...attributes.fields];
                                    fields[selectedFieldIndex].textTextColor = color;
                                    setAttributes({ fields });
                                }
                            }),
                            el('p', {}, __('Background Color', 'liquid-blocks')),
                            el(ColorPalette, {
                                value: attributes.fields[selectedFieldIndex].textBackgroundColor,
                                onChange: (color) => {
                                    let fields = [...attributes.fields];
                                    fields[selectedFieldIndex].textBackgroundColor = color;
                                    setAttributes({ fields });
                                }
                            })
                        ),
                        selectedFieldType === 'buttonText' && el('div', {},
                            el('p', {}, __('Font Size', 'liquid-blocks')),
                            el(components.RangeControl, {
                                value: attributes.fields[selectedFieldIndex].buttonFontSize,
                                onChange: (newSize) => {
                                    let newFields = [...attributes.fields];
                                    newFields[selectedFieldIndex].buttonFontSize = newSize;
                                    setAttributes({ fields: newFields });
                                },
                                min: 8, max: 200, step: 1
                            }),
                            el('p', {}, __('Text Color', 'liquid-blocks')),
                            el(ColorPalette, {
                                value: attributes.fields[selectedFieldIndex].buttonTextColor,
                                onChange: (color) => {
                                    let fields = [...attributes.fields];
                                    fields[selectedFieldIndex].buttonTextColor = color;
                                    setAttributes({ fields });
                                }
                            }),
                            el('p', {}, __('Background Color', 'liquid-blocks')),
                            el(ColorPalette, {
                                value: attributes.fields[selectedFieldIndex].buttonBackgroundColor,
                                onChange: (color) => {
                                    let fields = [...attributes.fields];
                                    fields[selectedFieldIndex].buttonBackgroundColor = color;
                                    setAttributes({ fields });
                                }
                            }),
                            el('p', {}, __('Border Color', 'liquid-blocks')),
                            el(ColorPalette, {
                                value: attributes.fields[selectedFieldIndex].buttonBorderColor,
                                onChange: (color) => {
                                    let fields = [...attributes.fields];
                                    fields[selectedFieldIndex].buttonBorderColor = color;
                                    setAttributes({ fields });
                                }
                            }),
                        )
                    )
                ),

                el('div', { className: 'liquid_blocks_slider tab-wrap' },
                    attributes.fields.length < magicNumber && el('button', {
                        className: 'tab-add',
                        onClick: addFieldset
                    }, __('Add Contents', 'liquid-blocks')),
                    attributes.fields.map((field, index) => {
                        const fieldId = `radio-${clientId}-${index}`;
                        checked = ( index == 0 ) ? 'checked' : '';
                        return [
                            el('input', { 
                                id: fieldId,
                                className: 'tab-switch',
                                type: 'radio',
                                name: fieldId,
                                value: index,
                                checked: selectedOption === index,
                                onChange: handleRadioChange,
                            }),
                            el('label', { 
                                htmlFor: fieldId,
                                className: 'tab-label',
                            }, index + 1 ),
                            el('div', { 
                                key: index, 
                                className: 'liquid_blocks_slider_fieldset tab-content',
                                onClick: (event) => handleClick(index, event),
                            },
                                el(MediaUpload, {
                                    onSelect: function( media ) {
                                        updateField(index, Object.assign({}, field, { image: media.url }));
                                    },
                                    allowedTypes: 'image',
                                    value: field.image,
                                    render: function( obj ) {
                                        return el('div', {},
                                            field.image && el('img', { src: field.image }),
                                            el('br'),
                                            el('button', {
                                                onClick: obj.open,
                                            }, field.image ? __('Change Image', 'liquid-blocks') : __('Select Image', 'liquid-blocks')),
                                            field.image && el('button', {
                                                onClick: function() {
                                                    updateField(index, Object.assign({}, field, { image: '' }));
                                                },
                                            }, __('Clear Image', 'liquid-blocks'))
                                        );
                                    },
                                }),
                                el('div', {}, __('Text', 'liquid-blocks')),
                                el(RichText, {
                                    tagName: 'p',
                                    className: 'ignoreClick',
                                    value: field.text,
                                    onChange: function( newText ) {
                                        updateField(index, Object.assign({}, field, { text: newText }));
                                    },
                                    onFocus: () => handleFieldSelect(index, 'text'),
                                    placeholder: '',
                                    style: { 
                                        textAlign: field.textAlignment,
                                        fontSize: `${field.textFontSize}px`,
                                        color: field.textTextColor,
                                        backgroundColor: field.textBackgroundColor,
                                    },
                                }),
                                el('p', {}, __('Button Text', 'liquid-blocks')),
                                el(RichText, {
                                    tagName: 'p',
                                    className: 'ignoreClick',
                                    value: field.buttonText,
                                    onChange: function( newText ) {
                                        updateField(index, { buttonText: newText });
                                    },
                                    onFocus: () => handleFieldSelect(index, 'buttonText'),
                                    placeholder: '',
                                    style: {
                                        textAlign: field.buttonAlignment,
                                        fontSize: `${field.buttonFontSize}px`,
                                        color: field.buttonTextColor,
                                        backgroundColor: field.buttonBackgroundColor,
                                        borderColor: field.buttonBorderColor,
                                    },
                                }),
                                el('p', {}, 'URL'),
                                el('input', {
                                    type: 'url',
                                    name: fieldId+'-url',
                                    value: field.url,
                                    onChange: function( event ) {
                                        updateField(index, Object.assign({}, field, { url: event.target.value }));
                                    },
                                    onFocus: () => handleFieldSelect(index, 'url'),
                                    placeholder: 'https://',
                                }),
                                el(CheckboxControl, {
                                    label: __('Open in new tab', 'liquid-blocks'),
                                    checked: field.openInNewTab,
                                    onChange: function( newVal ) {
                                        updateField(index, Object.assign({}, field, { openInNewTab: newVal }));
                                    },
                                }),
                                el('div', { className: 'fieldset-buttons' },
                                    index !== 0 ? el('a', {
                                        onClick: () => moveFieldUp(index),
                                        className: 'up-fieldset-button',
                                    }, '\u003C') : el('span'),
                                    el('span', {}, __('Sort', 'liquid-blocks')),
                                    index !== attributes.fields.length - 1 ? el('a', {
                                        onClick: () => moveFieldDown(index),
                                        className: 'down-fieldset-button',
                                    }, '\u003E') : el('span'),
                                    attributes.fields.length > 1 ? el('a', {
                                        onClick: function() { removeFieldset(index); },
                                        className: 'remove-fieldset-button'
                                    }, __('Delete this content', 'liquid-blocks')) : el('span'),
                                    showDuplicate && el('a', {
                                        onClick: () => duplicateFieldset(index),
                                        className: 'duplicate-fieldset-button',
                                    }, __('Duplicate', 'liquid-blocks')),
                                )
                            )
                        ];
                    })
                )
            ];
        },

        save: function() {
            return null;
        },
    } );
}( 
    window.wp.blocks,
    window.wp.blockEditor,
    window.wp.element,
    window.wp.components
) );
