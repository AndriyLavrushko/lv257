package com.softserve.edu.Resources.dto.asd;

public class SystemPrivilege {
    private String name;
    private String description;
    private boolean enabled;

    public SystemPrivilege() {
    }

    public SystemPrivilege(String name, String description, boolean enabled) {
        this.name = name;
        this.description = description;
        this.enabled = enabled;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }
}
