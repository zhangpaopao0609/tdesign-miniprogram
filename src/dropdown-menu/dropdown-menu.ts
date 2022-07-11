import { RelationsOptions, SuperComponent, wxComponent } from '../common/src/index';
import config from '../common/config';
import props from './props';
import type { TdDropdownMenuProps } from './type';

const { prefix } = config;
const name = `${prefix}-dropdown-menu`;

export interface DropdownMenuProps extends TdDropdownMenuProps {}

@wxComponent()
export default class DropdownMenu extends SuperComponent {
  properties = props; // todo: zindex activeColor

  data = {
    prefix,
    classPrefix: name,
    nodes: null,
    menus: null,
    activeIdx: -1,
    bottom: 0,
  };

  relations: RelationsOptions = {
    './dropdown-item': {
      type: 'child',
    },
  };

  lifetimes = {
    ready() {
      this.getAllItems();
    },
  };

  methods = {
    toggle(index: number) {
      const { activeIdx, duration } = this.data;
      const prevItem = this.data.nodes[activeIdx];
      const currItem = this.data.nodes[index];

      if (currItem?.data.disabled) return;

      if (activeIdx !== -1) {
        prevItem.triggerEvent('close');
        prevItem.setData(
          {
            show: false,
          },
          () => {
            setTimeout(() => {
              prevItem.triggerEvent('closed');
            }, duration);
          },
        );
      }

      if (index == null || activeIdx === index) {
        this.setData({
          activeIdx: -1,
        });
      } else {
        currItem.triggerEvent('open');
        this.setData({
          activeIdx: index,
        });
        currItem.setData(
          {
            show: true,
          },
          () => {
            setTimeout(() => {
              currItem.triggerEvent('opened');
            }, duration);
          },
        );
      }
    },
    getAllItems() {
      const nodes = this.getRelationNodes('./dropdown-item');
      const menus = nodes.map((a) => a.data);

      this.setData({
        nodes,
        menus,
      });
    },
    handleToggle(e: WechatMiniprogram.BaseEvent) {
      const { index } = e.currentTarget.dataset;

      this.toggle(index);
    },
  };
}
