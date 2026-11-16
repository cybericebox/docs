---
sidebar:
  label: Overview
  order: 1
title: Laboratory overview
description: What Laboratory is, what it does and how it is built.
---

Laboratory runs isolated training networks on a Kubernetes cluster. It builds the machines and networks of a task,
keeps every team apart from every other team, and gives people controlled ways in: a WireGuard VPN, a browser, and a
filtered path to the internet.

It is the lab layer of the Cyber&nbsp;ICE&nbsp;Box platform, and it also works on its own. Laboratory is a
**constructor**: it offers generic parts (devices, switches, gateways, cables, access rules, checks). It knows nothing
about events, courses, rankings or scores. A platform backend drives it through one gRPC API and keeps all of that
for itself.

## What it does

| Area | What you get |
|---|---|
| Topology | Labs made of containers or micro-VMs, switches, hubs and cables, with static or DHCP addressing |
| Isolation | One namespace, one address space and one set of keys per team; layer-2 segments that reach nobody by default |
| VPN access | A WireGuard server per team behind one shared UDP port; access rules per client and per network segment |
| Browser access | A device's web page or its console in a browser, through an HTTPS proxy, without entering the lab network |
| Internet | Outbound web access through a filtering gateway; nothing inbound, nothing but web |
| Checks | Automatic checks of what is inside a device: files, processes, ports, commands |
| Capacity | Scheduling through a window, quotas per tenant, reservations ahead of time, maintenance windows |
| Multi-tenancy | Several backends on one cluster; none can see another's objects |

## How it is built

A platform backend talks to the **management agent** over gRPC with mutual TLS. The agent creates Kubernetes custom
resources in the API group `laboratory.cybericebox.com`; the **operator** turns them into namespaces, pods, services
and network policies. A **node-agent** on every lab node plugs each device into its Open vSwitch segments, across nodes
when needed. Each team gets its own VPN server pod and, when it needs one, an internet gateway pod. One **proxy**
serves device web pages and consoles over HTTPS and shares a single UDP port between the VPN servers of all teams.

## Ways in

There are three, and everything else is denied: a **VPN** (a cable into one network segment), a **browser** (you stand at
one device, without entering its network) and a filtered **internet** path for outbound web traffic.

## What it does not do

- It does not keep scores, statistics or history; the backend aggregates the raw facts Laboratory hands over.
- It has no built-in DNS for lab hosts and no remote desktop (VNC, RDP) yet.
- It does not phone home: no telemetry, no update check.

## Where to go next

Installing and operating are for now described in the laboratory repository, in [DEPLOY.md](https://github.com/cybericebox/laboratory/blob/main/DEPLOY.md). These sections will appear here.
