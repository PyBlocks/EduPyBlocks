/**
 * @license
 * This file is part of EduPyBlocks https://github.com/carlosperate/EduPyBlocks
 *
 * Licensed under the MIT license, a copy can be found in:
 *   https://github.com/carlosperate/EduPyBlocks/blob/master/LICENSE
 */

/**
 * @fileoverview Blockly interface.
 */
'use strict';

/** Application namespace. */
var EduPyBlocks = EduPyBlocks || {};
EduPyBlocks.Blockly = EduPyBlocks.blockly || {};

/**
 * Blockly main workspace.
 * @type Blockly.WorkspaceSvg
 */
EduPyBlocks.Blockly.workspace = null;

/**
 * Blockly workspace toolbox XML.
 * @type Element
 */
EduPyBlocks.Blockly.xmlTree = null;


/**
 * Injects Blockly into a given HTML element with a given toolbox.
 * @param {!Element} blocklyEl Element to inject Blockly into.
 * @param {!string} toolboxXmlStr String containing the toolbox XML content.
 * @param {!string} blocklyPath String containing the Blockly directory path.
 */
EduPyBlocks.Blockly.inject = function(blocklyEl, toolboxXmlStr, blocklyPath) {
  // Remove any trailing slashes in the blockly path
  if (blocklyPath.substr(-1) === '/') {
    blocklyPath = blocklyPath.slice(0, -1);
  }

  toolboxXmlStr = toolboxXmlStr.replace(/{(\w+)}/g,
                                        function(m, p1) { return MSG[p1]; });
  EduPyBlocks.Blockly.xmlTree = Blockly.Xml.textToDom(toolboxXmlStr);
  // TODO: When introducing languages the XML toolbox has to be translated here

  EduPyBlocks.Blockly.workspace = Blockly.inject(blocklyEl, {
    collapse: true,
    comments: true,
    css: true,
    disable: true,
    maxBlocks: Infinity,
    media: blocklyPath + '/media/',
    rtl: false,
    scrollbars: true,
    sounds: true,
    toolbox: EduPyBlocks.Blockly.xmlTree,
    trashcan: true,
    grid: {
      spacing: 20,
      length: 3,
      colour: '#ccc',
      snap: true
    },
    zoom: {
      controls: true,
      wheel: false,
      startScale: 1.0,
      maxScale: 2,
      minScale: 0.2,
      scaleSpeed: 1.2
    }
  });

  // TODO: When introducing languages, load blocks from session storage here
};

/**
 * Generates the Python code from the workspace.
 * @return {!string} Generated Arduino code from the Blockly workspace.
 */
EduPyBlocks.Blockly.generatePythonCode = function() {
  return Blockly.Python.workspaceToCode(EduPyBlocks.Blockly.workspace);
};

/**
 * Generate the blocks XML from the workspace.
 * @return {!string} Generated XML code from the Blockly workspace.
 */
EduPyBlocks.Blockly.generateXml = function() {
  var xmlDom = Blockly.Xml.workspaceToDom(EduPyBlocks.Blockly.workspace);
  return Blockly.Xml.domToPrettyText(xmlDom);
};

/**
 * Parses the XML from its argument to add the blocks to the workspace.
 * @param {!string} blocksXmlStr Blocks XML in string format.
 * @return {!boolean} Indicates if the XML was parsed into blocks successfully.
 */
EduPyBlocks.Blockly.loadBlocksfromXmlStr = function(blocksXmlStr) {
  try {
    Blockly.Xml.domToWorkspace(blocksXmlStr, EduPyBlocks.Blockly.workspace);
  } catch (e) {
    return false;
  }
  return true;
};


/**
 * Discard all blocks from the workspace.
 */
EduPyBlocks.Blockly.discardBlocks = function() {
  EduPyBlocks.Blockly.workspace.clear();
};
