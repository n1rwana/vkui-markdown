import React, { Component } from 'react'
import Markdown from './Markdown';

import { Panel, Group, Div, FormLayout, FormItem, PanelHeader, PanelHeaderButton, ConfigProvider, Textarea, SplitLayout, SplitCol, Cell, Link } from '@vkontakte/vkui';
import { Icon20Check, Icon28BugOutline, Icon28EditOutline } from '@vkontakte/icons';
import { localStorage } from '@vkontakte/vkjs';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { text: "> Привет, мир!\n\n|1|2|\n|-: | :-|\n|3|5|\n|4|6|", editMode: false }
  }

  componentDidMount() {
    const state = JSON.parse(localStorage.getItem('vkuiMarkdownApp__text'));

    state
      ? this.setState({ text: state?.text, editMode: state?.editMode })
      : this.saveState();
  }

  saveState() { localStorage.setItem('vkuiMarkdownApp__text', JSON.stringify(this.state)); }
  componentDidUpdate() { this.saveState(); }

  render() {
    const { appearance, isDesktop, platform } = this.props;
    const { text, editMode } = this.state;
    const contentWidth = "1000px";

    return (
      <ConfigProvider platform={platform} appearance={appearance}>
        <SplitLayout style={{ justifyContent: "center", marginTop: "10px" }}>
          <SplitCol
            animate={true}
            spaced={isDesktop}
            width={isDesktop ? contentWidth : '100%'}
            maxWidth={isDesktop ? contentWidth : '100%'}
          >
            <SplitLayout
              id={'home'}
              activePanel={'home'}
            >
              <ConfigProvider platform={platform} appearance={appearance}>
                <Panel id={'home'}>
                  <PanelHeader left={
                    <PanelHeaderButton onClick={() => this.setState({ editMode: !editMode })}>
                      {editMode ? <Icon20Check width={28} height={28} /> : <Icon28EditOutline />}
                    </PanelHeaderButton>
                  }>Markdown</PanelHeader>

                  <Group>
                    {editMode ?
                      <FormLayout>
                        <FormItem>
                          <Textarea value={text} onChange={(e) => this.setState({ text: e.target.value })} />
                        </FormItem>
                      </FormLayout>
                      :
                      <Div><Markdown>{text}</Markdown></Div>
                    }
                  </Group>

                  <Group>
                    <Link href={"https://github.com/n1rwana/vkui-markdown"} target={"_blank"}>
                      <Cell before={<Icon28BugOutline />}>GitHub</Cell>
                    </Link>
                  </Group>
                </Panel>
              </ConfigProvider>
            </SplitLayout>
          </SplitCol>
        </SplitLayout>
      </ConfigProvider>
    )
  }
}
