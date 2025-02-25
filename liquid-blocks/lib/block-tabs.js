( function( blocks, blockEditor, element, components ) {
	var __ = wp.i18n.__;
	var el = element.createElement;
	var InnerBlocks = blockEditor.InnerBlocks;
	var RichText = blockEditor.RichText;
	var InspectorControls = blockEditor.InspectorControls;
	var PanelBody = components.PanelBody;
	var ColorPalette = components.ColorPalette;
	var useState = wp.element.useState;
	var useEffect = wp.element.useEffect;
	var useSelect = wp.data.useSelect;
	var Button = components.Button;

	// ── 子ブロック: liquid/tabs-tab ─────────────────────────────
	blocks.registerBlockType( 'liquid/tabs-tab', {
		title: __( 'Tab', 'liquid-blocks' ),
		icon: 'index-card',
		category: 'liquid',
		parent: [ 'liquid/tabs' ],
		attributes: {
			tabTitle: {
				type: 'string',
				default: ''
			}
		},
		supports: {
			inserter: false,
		},
		edit: function( props ) {
			var clientId = props.clientId;
			var attributes = props.attributes;
			var setAttributes = props.setAttributes;
			var { getBlockIndex, getBlockOrder, getBlockRootClientId } = useSelect( ( select ) => select( 'core/block-editor' ) );
			var rootClientId = getBlockRootClientId( clientId );
			var blockIndex = getBlockIndex( clientId, rootClientId );
			var blockOrder = getBlockOrder( rootClientId );

			function triggerUpButton() {
				var toolbar = document.querySelector( '.block-editor-block-toolbar' );
				if ( toolbar ) {
					var upButton = toolbar.querySelector( '.is-up-button' );
					if ( upButton ) {
						upButton.click();
					} else {
						console.log( 'UP button not found' );
					}
				}
			}
			function triggerDownButton() {
				var toolbar = document.querySelector( '.block-editor-block-toolbar' );
				if ( toolbar ) {
					var downButton = toolbar.querySelector( '.is-down-button' );
					if ( downButton ) {
						downButton.click();
					} else {
						console.log( 'DOWN button not found' );
					}
				}
			}

			return el(
				'div',
				{
					className: 'liquid-tabs-tab',
					style: {
						width: '100%',
						boxSizing: 'border-box',
						border: '1px solid #ccc',
						marginBottom: '1rem',
						position: 'relative'
					}
				},
				// 内部コンテンツ（InnerBlocks）
				el( InnerBlocks, {
					template: [
						[ 'core/paragraph', { placeholder: __( 'Tab content...', 'liquid-blocks' ) } ]
					],
					templateLock: false,
					renderAppender: InnerBlocks.ButtonBlockAppender,
				} ),
				// 並び替え・削除用のコントロール
				el(
					'div',
					{
						className: 'tab-controls',
						style: {
							position: 'absolute',
							top: '10px',
							right: '10px',
							display: 'flex',
							gap: '5px',
							zIndex: '2'
						}
					},
					blockIndex > 0 &&
						el( Button, {
							isSmall: true,
							isPrimary: true,
							onClick: triggerUpButton,
						}, __( 'Up', 'liquid-blocks' ) ),
					blockIndex < blockOrder.length - 1 &&
						el( Button, {
							isSmall: true,
							isPrimary: true,
							onClick: triggerDownButton,
						}, __( 'Down', 'liquid-blocks' ) ),
					el( Button, {
						isSmall: true,
						isDestructive: true,
						onClick: () =>
							wp.data.dispatch( 'core/block-editor' ).removeBlock( clientId ),
					}, __( 'Remove', 'liquid-blocks' ) )
				)
			);
		},
		save: function( props ) {
			var attributes = props.attributes;
			return el(
				'div',
				{
					className: 'liquid-tabs-tab',
					'data-tab-title': attributes.tabTitle,
					style: {
						width: '100%',
						boxSizing: 'border-box'
					}
				},
				el( InnerBlocks.Content )
			);
		},
	} );

	// ── 親ブロック: liquid/tabs ─────────────────────────────
	blocks.registerBlockType( 'liquid/tabs', {
		title: __( 'Tabs', 'liquid-blocks' ),
		icon: 'editor-table',
		category: 'liquid',
		attributes: {
			activeTabBackgroundColor: {
				type: 'string',
				default: '#ddd'
			},
			activeTabTextColor: {
				type: 'string',
				default: '#000000'
			},
			inactiveTabBackgroundColor: {
				type: 'string',
				default: '#f5f5f5'
			},
			inactiveTabTextColor: {
				type: 'string',
				default: '#000000'
			},
			uniqueId: {
				type: 'string',
				default: ''
			},
			tabsData: {
				type: 'array',
				default: []
			}
		},
		supports: {
			align: [ 'wide', 'full' ]
		},
		edit: function( props ) {
			var attributes = props.attributes;
			var setAttributes = props.setAttributes;
			var magicNumber = 10;
			var [ selectedTab, setSelectedTab ] = useState( 0 );
			var blocksArray = useSelect( ( select ) =>
				select( 'core/block-editor' ).getBlocks( props.clientId ), [ props.clientId ]
			);

			function handleTabClick( index ) {
				setSelectedTab( index );
			}

			// 各子ブロックの表示／非表示を切り替え
			useEffect( () => {
				blocksArray.forEach( function( block, index ) {
					var blockElement = document.querySelector( '[data-block="' + block.clientId + '"]' );
					if ( blockElement ) {
						if ( index === selectedTab ) {
							blockElement.style.visibility = 'visible';
							blockElement.style.height = 'auto';
							blockElement.style.minHeight = '';
							blockElement.style.padding = '';
							blockElement.style.pointerEvents = '';
						} else {
							blockElement.style.visibility = 'hidden';
							blockElement.style.height = '0';
							blockElement.style.minHeight = '0';
							blockElement.style.padding = '0';
							blockElement.style.pointerEvents = 'none';
						}
					}
				} );
			}, [ selectedTab, blocksArray ] );

			// 子ブロックの tabTitle をもとに tabsData を更新
			var newTabsData = blocksArray.map( function( block, index ) {
				return {
					title: block.attributes.tabTitle || __( 'Tab', 'liquid-blocks' ) + ' ' + ( index + 1 )
				};
			} );
			if ( JSON.stringify( newTabsData ) !== JSON.stringify( attributes.tabsData ) ) {
				setAttributes( { tabsData: newTabsData } );
			}

			return [
				// InspectorControls：タブ全体の色設定
				el(
					InspectorControls,
					{ key: 'inspector' },
					el(
						PanelBody,
						{ title: __( 'Tabs Colors', 'liquid-blocks' ), initialOpen: true },
						el( 'p', {}, __( 'Active Tab Background Color', 'liquid-blocks' ) ),
						el( ColorPalette, {
                            colors: wp.data.select( 'core/block-editor' ).getSettings().colors,
							value: attributes.activeTabBackgroundColor,
							onChange: function( newColor ) {
								setAttributes( { activeTabBackgroundColor: newColor } );
							}
						} ),
						el( 'p', {}, __( 'Active Tab Text Color', 'liquid-blocks' ) ),
						el( ColorPalette, {
                            colors: wp.data.select( 'core/block-editor' ).getSettings().colors,
							value: attributes.activeTabTextColor,
							onChange: function( newColor ) {
								setAttributes( { activeTabTextColor: newColor } );
							}
						} ),
						el( 'p', {}, __( 'Inactive Tab Background Color', 'liquid-blocks' ) ),
						el( ColorPalette, {
                            colors: wp.data.select( 'core/block-editor' ).getSettings().colors,
							value: attributes.inactiveTabBackgroundColor,
							onChange: function( newColor ) {
								setAttributes( { inactiveTabBackgroundColor: newColor } );
							}
						} ),
						el( 'p', {}, __( 'Inactive Tab Text Color', 'liquid-blocks' ) ),
						el( ColorPalette, {
                            colors: wp.data.select( 'core/block-editor' ).getSettings().colors,
							value: attributes.inactiveTabTextColor,
							onChange: function( newColor ) {
								setAttributes( { inactiveTabTextColor: newColor } );
							}
						} )
					)
				),
				// ブロック本体
				el(
					'div',
					{ className: 'liquid-tabs' },
					el(
						'div',
						{ className: 'tab-wrap', style: { display: 'flex', alignItems: 'center' } },
						blocksArray.map( function( block, index ) {
							var tabTitle = block.attributes.tabTitle || __( 'Tab', 'liquid-blocks' ) + ' ' + ( index + 1 );
							var bgColor = index === selectedTab ? attributes.activeTabBackgroundColor : attributes.inactiveTabBackgroundColor;
							var textColor = index === selectedTab ? attributes.activeTabTextColor : attributes.inactiveTabTextColor;
							if ( index === selectedTab ) {
								return el(
									'div',
									{
										key: index,
										style: { marginRight: '5px', display: 'flex', alignItems: 'center' }
									},
									el( RichText, {
										tagName: 'button',
										value: tabTitle,
										onChange: function( newTitle ) {
											wp.data.dispatch( 'core/block-editor' ).updateBlockAttributes( block.clientId, {
												tabTitle: newTitle,
											} );
										},
										placeholder: __( 'Tab title...', 'liquid-blocks' ),
										style: {
											cursor: 'pointer',
											padding: '5px 10px',
											background: bgColor,
											color: textColor,
											border: '1px solid #ccc',
											borderRadius: '5px 5px 0 0'
										},
										onClick: function() {
											handleTabClick( index );
										}
									} )
								);
							} else {
								return el(
									'button',
									{
										key: index,
										onClick: function() {
											handleTabClick( index );
										},
										style: {
											cursor: 'pointer',
											padding: '5px 10px',
											background: bgColor,
											color: textColor,
											marginRight: '5px',
											border: '1px solid #ccc',
											borderRadius: '5px 5px 0 0'
										}
									},
									tabTitle
								);
							}
						} ),
						blocksArray.length < magicNumber &&
							el(
								'button',
								{
									onClick: function() {
										var newBlock = wp.blocks.createBlock( 'liquid/tabs-tab', {
											tabTitle: __( 'Tab', 'liquid-blocks' ) + ' ' + ( blocksArray.length + 1 )
										} );
										wp.data.dispatch( 'core/block-editor' ).replaceInnerBlocks(
											props.clientId,
											[ ...blocksArray, newBlock ],
											false
										);
										setSelectedTab( blocksArray.length );
									},
									style: {
										padding: '5px 10px',
										background: '#4CAF50',
										color: 'white',
										border: 'none',
										cursor: 'pointer',
										border: '1px solid #ccc',
										borderRadius: '5px 5px 0 0'
									}
								},
								__( 'Add Tab', 'liquid-blocks' )
							)
					),
					el(
						'div',
						{ className: 'tabs-container', style: { width: '100%' } },
						el( InnerBlocks, {
							allowedBlocks: [ 'liquid/tabs-tab' ],
							templateLock: false,
							template: [
								[
									'liquid/tabs-tab',
									{ tabTitle: __( 'Tab', 'liquid-blocks' ) + ' 1' }
								]
							]
						} )
					)
				)
			];
		},
		// 保存時の出力：タブナビゲーションにラジオボタンとラベルを出力し、
		// 各ラベルにはタブのテキストを表示するとともに、style 属性で
		// CSSカスタムプロパティとして選択時（active）と未選択時（inactive）の色を指定
		save: function( props ) {
			var attributes = props.attributes;
			var uniqueId = attributes.uniqueId;
			var activeBg = attributes.activeTabBackgroundColor;
			var activeText = attributes.activeTabTextColor;
			var inactiveBg = attributes.inactiveTabBackgroundColor;
			var inactiveText = attributes.inactiveTabTextColor;
			var tabsData = attributes.tabsData;
			return el(
				'div',
				{ className: 'liquid-tabs', 'data-unique-id': uniqueId },
				el(
                    'div',
                    { className: 'liquid-tabs-navigation' },
                    tabsData.map(function(tab, index) {
                        return el(
                            'div',
                            {
                                className: 'liquid-tabs-item' + ( index === 0 ? ' active' : '' ),
                                style: {
                                    '--active-bg': activeBg,
                                    '--active-text': activeText,
                                    '--inactive-bg': inactiveBg,
                                    '--inactive-text': inactiveText
                                }
                            },
                            tab.title
                        );
                    })
                ),
				el(
					'div',
					{ className: 'liquid-tabs-container' },
					el( InnerBlocks.Content )
				)
			);
		},
	} );
}(
	window.wp.blocks,
	window.wp.blockEditor,
	window.wp.element,
	window.wp.components
) );
