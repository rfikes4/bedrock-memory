/* eslint-disable no-undef */
// ==UserScript==
// @name        UI Tools - playcanvas.com
// @namespace   PlayCanvasEditorExtensions
// @match       https://playcanvas.com/editor/scene/*
// @version     1.0
// @description The button actions from this extension will be on the selected entity and it's children
// ==/UserScript==

// Copy into 'Violentmonkey' browser extension to use: https://violentmonkey.github.io/get-it/
// Editor api: https://github.com/playcanvas/editor-api/blob/main/docs/modules.md

// CONSTANTS
const UI_ATLAS_ID = 125894182;
// const UI_ATLAS_NAME = 'HUD_Atlas_0.png';

function getPathToEntity(entity) {
    let path = entity.get('name');
    while (entity.parent) {
        entity = findEntityByGuid(entity.parent.get('resource_id'));
        path = entity.get('name') + '->' + path;
    }
    return path;
}

function instantiateAllMenus() {
    const menus = editor.assets.filter((asset) => {
        if (asset.get('type') == 'template' &&
            asset.get('tags').includes('IMENU')) {
            // console.log(asset.json());
            return true;
        }
        return false;
    })
    editor.assets.instantiateTemplates(menus, editor.selection.item);
}

function instantiateAllPopups() {
    const menus = editor.assets.filter((asset) => {
        if (asset.get('type') == 'template' &&
            asset.get('tags').includes('IPOPUP')) {
            // console.log(asset.json());
            return true;
        }
        return false;
    })
    editor.assets.instantiateTemplates(menus, editor.selection.item);
}

function findAssetsByName(name) {
    // findOne / filter
    return editor.assets.filter((asset) => {
        if (asset.get('name').startsWith(name)) {
            // console.log('findAssetsByName match: ', name, asset.get('name'));
            return true;
        }
        return false;
    });
}

function findEntityByGuid(guid) {
    const matches = editor.entities.root.filter((item) => {
        if (item.get('resource_id') == guid) {
            return true;
        }
        return false;
    });

    return matches[0];
}

function getAssetNameFromId(id) {
    const result = editor.assets.findOne((asset) => {
        if (asset.get('id') == id) {
            // console.log('getAssetNameFromId - match', asset.json());
            return true;
        }
        return false;
    });

    return result?.get('name');
}

function isSpriteInAtlas(id) {
    return editor.assets.findOne((asset) => {
        if (asset.get('id') == id) {
            return true;
        }
        return false;
    })?.get('data.textureAtlasAsset') == UI_ATLAS_ID;
}

function replaceAssetWithAtlasSprite(name, entity) {
    let foundReplacement = 0;
    const assetsMatchingName = findAssetsByName(name);
    for (let i = 0; i < assetsMatchingName.length; i++) {
        const asset = assetsMatchingName[i];
        if (asset.get('type') == 'sprite' && asset.get('data.textureAtlasAsset') == UI_ATLAS_ID) {
            foundReplacement = 1;
            entity.set('components.element.textureAsset', null);
            entity.set('components.element.spriteAsset', asset.get('id'));
        }
    }

    if (!foundReplacement) {
        console.warn(`Element is not using texture atlas - asset:${name}, entity:${getPathToEntity(entity)}`)
    } else {
        console.log(`%cElement updated to use texture atlas - asset:${name}, entity:${getPathToEntity(entity)}`, 'color:green')
    }
    return foundReplacement;
}

function updateElementsToUseTextureAtlas(entity) {
    let assetsChanged = 0;
    if (entity && entity.get('components.element.type') == 'image') {
        const textureAsset = entity.get('components.element.textureAsset');
        const spriteAsset = entity.get('components.element.spriteAsset');
        if ((textureAsset || spriteAsset) &&
            (!spriteAsset || !isSpriteInAtlas(spriteAsset))
        ) {
            const name = getAssetNameFromId(textureAsset ? textureAsset : spriteAsset);
            if (!name) {
                console.error('Invalid asset Id on entity: ' + getPathToEntity(entity));
            } else {
                // console.log('Attempting to replace: ' + name);
                assetsChanged += replaceAssetWithAtlasSprite(name, entity);
            }
        }
    }

    entity?.children?.forEach((child) => {
        if (child) {
            assetsChanged += updateElementsToUseTextureAtlas(child);
        }
    });
    return assetsChanged;
}

// PlayCanvas UI for Tools
function createUpdateSpritesToAtlasButton() {
    const btn = new pcui.Button({ text: 'Update Sprites to use Atlas' });
    btn.style.position = 'absolute';
    btn.style.bottom = '10px';
    btn.style.right = '10px';
    editor.call('layout.viewport').append(btn);

    btn.on('click', () => {
        const rootItem = editor.selection.item;
        const assetsChanged = updateElementsToUseTextureAtlas(rootItem);

        console.log(`%cAssets Changed: ${assetsChanged}`, 'color:green');
    });
}

function createInstantiateMenusButton() {
    const btn = new pcui.Button({ text: 'Instantiate Menu Templates' });
    btn.style.position = 'absolute';
    btn.style.bottom = '40px';
    btn.style.right = '10px';
    editor.call('layout.viewport').append(btn);

    btn.on('click', () => {
        instantiateAllMenus();
    });
}

function createInstantiatePopupsButton() {
    const btn = new pcui.Button({ text: 'Instantiate Popup Templates' });
    btn.style.position = 'absolute';
    btn.style.bottom = '70px';
    btn.style.right = '10px';
    editor.call('layout.viewport').append(btn);

    btn.on('click', () => {
        instantiateAllPopups();
    });
}

createUpdateSpritesToAtlasButton();
createInstantiateMenusButton();
createInstantiatePopupsButton();
