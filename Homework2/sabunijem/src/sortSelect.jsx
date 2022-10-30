// SRC: https://react-select.com/advanced#sortable-multiselect
import Select, { components } from "react-select";
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from "react-sortable-hoc";

function arrayMove(array, from, to) {
  const slicedArray = array.slice();
  slicedArray.splice(
    to < 0 ? array.length + to : to,
    0,
    slicedArray.splice(from, 1)[0]
  );
  return slicedArray;
}

const SortableMultiValue = SortableElement((props) => {
  const onMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const innerProps = { ...props.innerProps, onMouseDown };
  return <components.MultiValue {...props} innerProps={innerProps} />;
});

const SortableMultiValueLabel = SortableHandle((props) => (
  <components.MultiValueLabel {...props} />
));

const SortableSelect = SortableContainer(Select);

export const MultiSelectSort = ({ options, selected, onSelect, limit }) => (
  <SortableSelect
    useDragHandle
    axis="xy"
    onSortEnd={({ oldIndex, newIndex }) => {
      onSelect(arrayMove(selected, oldIndex, newIndex));
    }}
    className="multi-select"
    isOptionDisabled={() => selected.length >= limit}
    distance={4}
    getHelperDimensions={({ node }) => node.getBoundingClientRect()}
    isMulti
    options={options.map((value) => ({ value, label: value }))}
    value={selected.map((value) => ({ value, label: value }))}
    onChange={(options) => onSelect(options.map((d) => d.value))}
    components={{
      MultiValue: SortableMultiValue,
      MultiValueLabel: SortableMultiValueLabel,
    }}
    closeMenuOnSelect={false}
  />
);
