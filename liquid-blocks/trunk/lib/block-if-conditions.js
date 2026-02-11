( function( blocks, blockEditor, element, components ) {
	var __ = wp.i18n.__;
	var el = element.createElement;
	var InnerBlocks = blockEditor.InnerBlocks;
	var InspectorControls = blockEditor.InspectorControls;
	var PanelBody = components.PanelBody;
	var SelectControl = components.SelectControl;
	var TextControl = components.TextControl;
	var Fragment = element.Fragment;

	blocks.registerBlockType( 'liquid/if-conditions', {
		title: __( 'If conditions', 'liquid-blocks' ),
		icon: 'admin-network',
		category: 'liquid',
		attributes: {
			visibility: {
				type: 'string',
				default: ''
			},
			role: {
				type: 'string',
				default: ''
			},
			parameters: {
				type: 'string',
				default: ''
			},
			conditionType: {
				type: 'string',
				default: ''
			}
		},
		transforms: {
			from: [
				{
					// Convert from core/group block
					type: 'block',
					blocks: [ 'core/group' ],
					transform: function( attributes, innerBlocks ) {
						return blocks.createBlock( 'liquid/if-conditions', {}, innerBlocks );
					}
				}
			]
		},
		edit: function( props ) {
			var attributes = props.attributes;
			var setAttributes = props.setAttributes;
			var className = ( props.className || '' ) + ' liquid-if-conditions';

			return el(
				Fragment,
				null,
				el(
					InspectorControls,
					null,
					el(
						PanelBody,
						{ title: __( 'Display Settings', 'liquid-blocks' ), className: 'liquid-panel' },
						el( SelectControl, {
							label: __( 'Display Options', 'liquid-blocks' ),
							value: attributes.visibility,
							options: [
								{ label: __( 'Default', 'liquid-blocks' ), value: '' },
								{ label: __( 'is_user_logged_in', 'liquid-blocks' ), value: 'is_user_logged_in' },
								{ label: __( 'is_front_page', 'liquid-blocks' ), value: 'is_front_page' },
								{ label: __( 'is_home', 'liquid-blocks' ), value: 'is_home' },
								{ label: __( 'is_page', 'liquid-blocks' ), value: 'is_page' },
								{ label: __( 'is_single', 'liquid-blocks' ), value: 'is_single' },
								{ label: __( 'is_singular', 'liquid-blocks' ), value: 'is_singular' },
								{ label: __( 'is_archive', 'liquid-blocks' ), value: 'is_archive' },
								{ label: __( 'is_category', 'liquid-blocks' ), value: 'is_category' },
								{ label: __( 'is_tag', 'liquid-blocks' ), value: 'is_tag' },
								{ label: __( 'is_author', 'liquid-blocks' ), value: 'is_author' },
								{ label: __( 'is_tax', 'liquid-blocks' ), value: 'is_tax' },
								{ label: __( 'has_post_format', 'liquid-blocks' ), value: 'has_post_format' },
								{ label: __( 'wp_is_mobile', 'liquid-blocks' ), value: 'wp_is_mobile' }
							],
							onChange: function( newVal ) {
								setAttributes({ visibility: newVal });
							}
						}),
						( attributes.visibility === 'is_user_logged_in' &&
							attributes.conditionType === '' )
							? el( SelectControl, {
								label: __( 'Role Type', 'liquid-blocks' ),
								value: attributes.role,
								options: [
									{ label: __( 'All Users', 'liquid-blocks' ), value: '' },
									{ label: __( 'Administrator', 'liquid-blocks' ), value: 'administrator' },
									{ label: __( 'Editor', 'liquid-blocks' ), value: 'editor' },
									{ label: __( 'Author', 'liquid-blocks' ), value: 'author' },
									{ label: __( 'Contributor', 'liquid-blocks' ), value: 'contributor' },
									{ label: __( 'Subscriber', 'liquid-blocks' ), value: 'subscriber' }
								],
								onChange: function( newVal ) {
									setAttributes({ role: newVal });
								}
							})
							: null,
						( attributes.visibility === 'is_page' ||
							attributes.visibility === 'is_single' ||
							attributes.visibility === 'is_singular' ||
							attributes.visibility === 'is_category' ||
							attributes.visibility === 'is_tag' ||
							attributes.visibility === 'is_author' ||
							attributes.visibility === 'is_tax' ||
							attributes.visibility === 'has_post_format' )
							? el( TextControl, {
								label: __( 'Parameters (Option)', 'liquid-blocks' ),
								value: attributes.parameters,
								onChange: function( newVal ) {
									setAttributes({ parameters: newVal });
								}
							})
							: null,
						el( SelectControl, {
							label: __( 'Condition Type', 'liquid-blocks' ),
							value: attributes.conditionType,
							options: [
								{ label: __( 'Match', 'liquid-blocks' ), value: '' },
								{ label: __( 'Not Match', 'liquid-blocks' ), value: 'not_match' }
							],
							onChange: function( newVal ) {
								setAttributes({ conditionType: newVal });
							}
						})
					)
				),
				el(
					'div',
					{ className: className },
					el( InnerBlocks, null )
				)
			);
		},
		save: function() {
			return el(
				'div',
				{ className: 'liquid-if-conditions' },
				el( InnerBlocks.Content, null )
			);
		}
	});
} )( wp.blocks, wp.blockEditor, wp.element, wp.components );
