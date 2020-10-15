#!/bin/bash
#*******************************************************************************
# Copyright (c) 2013, 2019 LA Referencia / Red CLARA and others
#
# This file is part of LRHarvester v4.x software
#
#  This program is free software: you can redistribute it and/or modify
#     it under the terms of the GNU General Public License as published by
#     the Free Software Foundation, either version 3 of the License, or
#     (at your option) any later version.
#
#     This program is distributed in the hope that it will be useful,
#     but WITHOUT ANY WARRANTY; without even the implied warranty of
#     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#     GNU General Public License for more details.
#
#     You should have received a copy of the GNU General Public License
#     along with this program.  If not, see <https://www.gnu.org/licenses/>.
#     
#     For any further information please contact
#     Lautaro Matas <lmatas@gmail.com>
#*******************************************************************************
java -agentlib:jdwp=transport=dt_socket,server=y,suspend=y,address=8888 -jar $1
