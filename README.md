# BPMN Editor

This extensions uses bpmn-js to open and modify *.bpmn files

## Added features

- Uses the deep-nested bpmn-js feature, allowing you to traverse sub processes instead of expanding them in a single top level view
- Adds colors using the bpmn-js-color-picker module
- If the file is empty, loads an empty bpmn xml

## Development

- `yarn install && yarn web:install`
- `yarn web:dev` to build the webapp continuously
- Run the plugin from within the VSCode instance by hitting F5