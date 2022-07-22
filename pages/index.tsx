// TODO: import-ordering prettier or eslint
import type { NextPage } from 'next'
import Head from 'next/head'
import React, { useState } from 'react'
import { nanoid } from 'nanoid'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

import { ComponentId, ComponentConfig, SavedComponentConfigs } from 'types'
import { drawableComponents } from 'components/libraryComponents'
import { ComponentEditor } from 'components/componentEditor'
import { readComponentConfigs, saveComponentConfigs } from 'utils/localStorage'

import styles from 'styles/Home.module.css'

const Home: NextPage = () => {
  const [componentConfigs, setComponentConfigs] =
    useState<SavedComponentConfigs>(readComponentConfigs())

  const [selectedComponentId, setSelectedComponentId] =
    useState<ComponentId | null>(null)

  return (
    <div className={styles.app}>
      <Head>
        <title>composition</title>
        <meta name="description" content="Design with your design system" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.header}>
        composition
        <Select
          className={styles.addComponent}
          size="small"
          value=""
          onChange={(event) => {
            const componentType = event.target.value as keyof ComponentConfig
            const updatedComponentConfigs = {
              ...componentConfigs,
              [nanoid()]: {
                type: componentType,
                config: drawableComponents[componentType].defaultConfig,
              },
            }
            setComponentConfigs(updatedComponentConfigs)
            saveComponentConfigs(updatedComponentConfigs)
          }}
        >
          {Object.keys(drawableComponents).map((componentName) => (
            <MenuItem value={componentName} key={componentName}>
              {componentName}
            </MenuItem>
          ))}
        </Select>
      </div>

      <div
        className={styles.main}
        onClick={() => {
          // If the click gets here, a component was not clicked because `stopPropagation` is called whenever a component is clicked.
          setSelectedComponentId(null)
        }}
      >
        {Object.keys(componentConfigs).map((componentId) => {
          const { type, config } = componentConfigs[componentId]
          return (
            <div
              key={componentId}
              className={
                componentId === selectedComponentId
                  ? styles.selected
                  : undefined
              }
              onClick={(event) => {
                setSelectedComponentId(componentId)
                event.stopPropagation()
              }}
            >
              {/* Ensure children do not swallow clicks */}
              <div style={{ pointerEvents: 'none' }}>
                {/* TODO: need typescript magic */}
                {drawableComponents[type].render(config)}
              </div>
            </div>
          )
        })}
      </div>

      <div className={styles.componentEditor}>
        <ComponentEditor
          componentId={selectedComponentId}
          componentConfigs={componentConfigs}
        />
      </div>
    </div>
  )
}

export default Home
